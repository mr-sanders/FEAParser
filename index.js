var fs = require('fs');
var path = require('path');
var rdir = require('recursive-readdir');

rdir('Records', function(err, files){
	files
		.filter(function(file) {
			return path.basename(file) == 'GetFEAData.txt' ? 1 : 0;
		})
		.forEach(function(file){
			fs.readFile(file, function(e, data){
				var buf = data.toString();

				/*==================================
				=            Get planes            =
				==================================*/
				
				var planes = buf.split(/Profiles.*/);
				planes.shift();
				planes[0] = planes[0].replace(/^[\r\n]/gm, "");
				
				var xz = planes[0].split(/^\s/gm);
				xz.shift();

				var jsonData = {};

				xz.forEach(function(dataLine, lineIndex, dataArr) {
					var temp = dataLine.split(/[\r\n]/gm);

					/*----------  get z values  ----------*/
					
					var zkey = temp.shift().match(/(z\s=\s+)\d+,*\d*/g)[0].replace(/z\s=\s+/, "").replace(',', '.');

					/*----------  get keys for array  ----------*/

					var arrkeys = temp.shift().match(/(\w(?=\s)|\w+(\s?\w+|-\w+))/g);

					jsonData[zkey] = {};

					/*----------  get values  ----------*/

					temp.pop();
					
					temp.forEach(function(vals, i, arr) {
						var values = vals.split(/\s+/g);
						for (var j = 0; j <= values.length - 1; j++) {
							if(!jsonData[zkey][arrkeys[j]]) jsonData[zkey][arrkeys[j]] = [];
							jsonData[zkey][arrkeys[j]][i] = Number(values[j]).toString().replace('.', ',');
						};
					});
				});
				console.log(path.dirname(file));
				/*----------  Write output files  ----------*/
				
				// if (!fs.existsSync('Output')){
				//   fs.mkdirSync('Output');
				// }
				// var wstream = fs.createWriteStream('Output/'+ path.dirname(file) +'.csv');

				// var zkeys = Object.keys(jsonData);
				// zkeys.forEach(function(item1, i1, arr1) {
				// 	var keys = Object.keys(jsonData[item1]);
				// 	wstream.write('"' + item1.toString().replace('.',',') + '"\r\n');
				// 	keys.forEach(function(item2, i2, arr2) {
				// 		wstream.write('"' + item2 + '",');
				// 	});
				// 	wstream.write('\r\n');

				// 	for (var i = 0; i <= jsonData[item1][keys[0]].length - 1; i++) {
				// 		keys.forEach(function(item2, i2, arr2) {
				// 			wstream.write('"=' + jsonData[item1][item2][i] + '",');
				// 		});
				// 		wstream.write('\r\n');
				// 	};
				// 	wstream.write('\r\n');
				// });
				// wstream.end();

				/*=====  End of Get planes  ======*/


			});
		});
});