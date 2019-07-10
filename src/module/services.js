const services = [
  'ScheduleService',
  'ProjektService',
  'FilterService',
  'ClientsService',
  'SettingsService',
  'UrllistService',
  'UsersService',
  'DownloadsService'
];

function firstCharLower(string) {
    return string.charAt(0).toLowerCase() + string.slice(1);
}

for (let service of services)
  module.exports[firstCharLower(service)] = new (require('../service/'+service+'.js').default)()
