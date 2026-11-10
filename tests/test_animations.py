"""The animation directory must work independently of the portfolio checkout."""
from functools import partial
from http.server import ThreadingHTTPServer
from threading import Thread
import unittest
from playwright.sync_api import sync_playwright, expect
from test_portfolio import ROOT, QuietHandler

ANIMATIONS = {
    'flexit': None,  # The supplied MP4 replaces the generated SVG scene.
    'utgiftsanalyse': 'grow',
    'eiendomsskatt-analyse': 'draw',
    'e-skatt-assistent': 'devicePulse',
    'fakass': 'pkt',
    'invoiceflowai': 'scan',
}

class AnimationTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.servers=[]
        for directory in [ROOT/'animations', ROOT]:
            server=ThreadingHTTPServer(('127.0.0.1',0),partial(QuietHandler,directory=str(directory)))
            Thread(target=server.serve_forever,daemon=True).start()
            cls.servers.append(server)
        cls.folder=f'http://127.0.0.1:{cls.servers[0].server_port}'
        cls.site=f'http://127.0.0.1:{cls.servers[1].server_port}'
        cls.pw=sync_playwright().start()
        cls.browser=cls.pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])

    @classmethod
    def tearDownClass(cls):
        cls.browser.close();cls.pw.stop()
        for server in cls.servers:server.shutdown();server.server_close()

    def setUp(self):
        self.context=self.browser.new_context(viewport={'width':1000,'height':700},reduced_motion='no-preference')
        self.page=self.context.new_page()
        self.page.set_default_timeout(10000)
        self.errors=[];self.failed=[]
        self.page.on('pageerror',lambda error:self.errors.append(str(error)))
        # Chromium may cancel a metadata-only media request or stop it on navigation.
        self.page.on('requestfailed',lambda request:self.failed.append(f'{request.url}: {request.failure}')
                     if not (request.resource_type=='media' and request.failure=='net::ERR_ABORTED') else None)
        self.page.on('response',lambda response:self.failed.append(response.url) if response.status>=400 and not response.url.endswith('/favicon.ico') else None)

    def tearDown(self):
        self.context.close()
        self.assertEqual(self.errors,[])
        self.assertEqual(self.failed,[])

    def test_six_independent_scenes_and_real_pause(self):
        for stem,animation_name in ANIMATIONS.items():
            with self.subTest(project=stem):
                self.page.goto(f'{self.folder}/{stem}.html',wait_until='load')
                if stem=='flexit':
                    video=self.page.locator('video')
                    expect(video).to_be_visible()
                    self.page.wait_for_function('document.querySelector("video").currentTime > 0.1')
                    metadata=video.evaluate('v=>({width:v.videoWidth,height:v.videoHeight,duration:v.duration,muted:v.muted,loop:v.loop,inline:v.playsInline,controls:v.controls,fit:getComputedStyle(v).objectFit})')
                    self.assertEqual(metadata,{'width':1080,'height':1080,'duration':18,'muted':True,'loop':True,'inline':True,'controls':True,'fit':'contain'})
                else:
                    expect(self.page.locator('svg').first).to_be_visible()
                    names=self.page.evaluate('document.getAnimations().map(a=>a.animationName)')
                    self.assertIn(animation_name,names)
                self.page.locator('#motion').click()
                expect(self.page.locator('#motion')).to_have_attribute('aria-pressed','true')
                frozen=self.page.evaluate('''async () => {
                    await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
                    const video=document.querySelector('video');
                    const time=video?.currentTime;
                    const animations=document.getAnimations();
                    const times=animations.map(a=>a.currentTime);
                    await new Promise(resolve=>setTimeout(resolve,200));
                    return (!video || (video.paused && Math.abs(video.currentTime-time)<0.05)) &&
                      animations.every((a,i)=>a.playState==='paused' && Math.abs(a.currentTime-times[i])<1);
                }''')
                self.assertTrue(frozen)
                self.page.locator('#motion').click()
                expect(self.page.locator('#motion')).to_have_attribute('aria-pressed','false')
                if stem=='flexit':
                    expect(video).to_have_js_property('paused',False)
                    # Native controls and the shared pause button must agree.
                    video.evaluate('v=>v.pause()')
                    expect(self.page.locator('#motion')).to_have_attribute('aria-pressed','true')
                    video.evaluate('v=>v.play()')
                    expect(self.page.locator('#motion')).to_have_attribute('aria-pressed','false')
                    # Observe a complete loop; a failed seek must not masquerade as looping.
                    self.page.wait_for_function('document.querySelector("video").currentTime > 17',timeout=25000)
                    self.page.wait_for_function('document.querySelector("video").currentTime < 1',timeout=5000)
                    expect(video).to_have_js_property('paused',False)
                else:
                    self.assertTrue(self.page.evaluate("document.getAnimations().some(a=>a.playState==='running')"))

    def test_portable_gallery_embeds_and_reduced_motion(self):
        self.page.goto(f'{self.folder}/index.html',wait_until='load')
        frames=self.page.locator('iframe')
        expect(frames).to_have_count(6)
        for i in range(6):
            frame=frames.nth(i);frame.scroll_into_view_if_needed()
            content=frame.content_frame
            expect(content.locator('video' if i==0 else 'svg').first).to_be_visible()
            expect(content.locator('.controls')).not_to_be_visible()
            if i==0:
                expect(content.locator('video')).to_have_js_property('controls',False)
                expect(content.locator('video')).to_have_js_property('paused',False)
        expect(frames.first.content_frame.locator('video')).to_have_js_property('paused',True)
        self.page.emulate_media(reduced_motion='reduce')
        self.page.goto(f'{self.folder}/flexit.html',wait_until='load')
        expect(self.page.locator('body')).to_have_class('is-paused')
        expect(self.page.locator('#motion')).to_have_attribute('aria-pressed','true')
        expect(self.page.locator('video')).to_have_js_property('paused',True)
        self.assertTrue(self.page.evaluate("document.getAnimations().every(a=>a.playState!=='running')"))

    def test_old_links_redirect_to_the_same_sources(self):
        paths={
            'project-preview.html?project=flexit&embed=1':'flexit',
            'project-preview.html?project=utgifter':'utgiftsanalyse',
            'project-preview.html?project=eiendom':'eiendomsskatt-analyse',
            'project-preview.html?project=invoice':'invoiceflowai',
            'project-preview.html?project=unknown':'invoiceflowai',
            'fakass-demo.html':'fakass',
            'eiendomsskatt-demo.html':'e-skatt-assistent',
        }
        for old,stem in paths.items():
            with self.subTest(path=old):
                self.page.goto(f'{self.site}/{old}',wait_until='load')
                self.page.wait_for_url(f'**/animations/{stem}.html*')
                expect(self.page.locator('video' if stem=='flexit' else 'svg').first).to_be_visible()
                if 'embed=1' in old:expect(self.page.locator('.controls')).not_to_be_visible()

if __name__=='__main__':unittest.main(verbosity=2)
