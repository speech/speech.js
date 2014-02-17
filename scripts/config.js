/**
 * @license AGPLv3 2013
 * @author indolering
 */
var $ = require('/scripts/libs/jquery'),
  ready = require('/scripts/libs/ready'),
  URI = require('/scripts/libs/URI'),
  DNS = require('/scripts/dns');

    function config() {
      console.log('config created');

      //redo this correctly using handlebar partials
      this.createEntries = function(records) {
        if (typeof records === 'undefined' ||records === null || records.length < 1) {
          records = DNS.getRecords();
        }
        var accordion = $('#accordion');
        records.forEach(function(r) {
          if (r.name !== undefined && r.name !== 'undefined') {

            //TODO: redo using Jade or handlebars
            var content =
              '<div id ="' + r.name + '-panel" class="panel panel-default">' +
                '<div class="panel-heading">' +
                '<h4 class="panel-title">' +
                '<h4 class="panel-title">' +
                '<a data-toggle="collapse" data-parent="#accordion" href="#' + r.name + '-container">' +
                r.name + '</a>' +
                '</h4>' +
                '    </div>' +
                '    <div id="' + r.name + '-container" class="panel-collapse collapse">' +
                '    <div class="panel-body"><pre id="' + r.name + '-value">' + JSON.stringify(r.value, undefined, 2) +
                '</pre></div>' +
                '<button onclick=\'config.del("' + r.name + '")\'' +
                ' class="pull-right btn btn-danger">delete</button>' +
                '<a href=#editor>' +
                '<button onclick=\'config.edit("' + r.name + '")\'' +
                ' class="pull-right btn btn-warning">edit</button>' +
                '</a>' +
                '    </div>' +
                '  </div>';
          }
          accordion.append(content);
        });

      }

      this.edit = function(name) {

        $('#editor').val(JSON.stringify(DNS.lookup(name).value,undefined,2));
        $('#name').val(name);
      };

      this.save = function() {
        var name = $('#name').val();
        var value = $('#editor').val();
        DNS.save({name: name, value: value});
        config.createEntries([DNS.lookup(name)]);
      };

      this.del = function(name) {
        $('#' + name + '-panel').remove();
        DNS.delete(name);
      };

    };

module.exports = new config();