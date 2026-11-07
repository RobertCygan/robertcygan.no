// Compatibility redirect only. Animation sources now live in animations/.

const pages = { flexit: 'flexit', utgifter: 'utgiftsanalyse', eiendom: 'eiendomsskatt-analyse', invoice: 'invoiceflowai' };
const params = new URLSearchParams(location.search);
const project = params.get('project');
const page = Object.hasOwn(pages, project) ? pages[project] : pages.invoice;
params.delete('project');
const url = new URL('animations/' + page + '.html', location.href);
url.search = params.toString();
location.replace(url.href);
