var fs = require('fs');
var path = require('path');
var rdir = require('recursive-readdir');

rdir('Records', function(err, files){
	// files
	// 	.filter(function(file) {
	// 		return path.basename(file) == 'GetFEAData.txt' ? 1 : 0;
	// 	})
	// 	.forEach(function(file){

	// 		console.log('reading file - ' + file); //Console read step
			
	// 		fs.readFile(file, function(e, data){
	// 			var buf = data.toString();

	// 			/*==================================
	// 			=            Get Data            =
	// 			==================================*/
				
	// 			var planes = buf.split(/Profiles.*/);
	// 			planes.shift();
	// 			planes[0] = planes[0].replace(/^[\r\n]/gm, "");
				
	// 			var xz = planes[0].split(/^\s/gm);
	// 			xz.shift();

	// 			var jsonData = {};

	// 			xz.forEach(function(dataLine, lineIndex, dataArr) {
	// 				var temp = dataLine.split(/[\r\n]/gm);

	// 				/*----------  get z values  ----------*/
					
	// 				var zkey = temp.shift().match(/(z\s=\s+)\d+,*\d*/g)[0].replace(/z\s=\s+/, "").replace(',', '.');

	// 				/*----------  get keys for array  ----------*/

	// 				var arrkeys = temp.shift().match(/(\w(?=\s)|\w+(\s?\w+|-\w+))/g);

	// 				jsonData[zkey] = {};

	// 				/*----------  get values  ----------*/

	// 				temp.pop();
					
	// 				temp.forEach(function(vals, i, arr) {
	// 					var values = vals.split(/\s+/g);
	// 					for (var j = 0; j <= values.length - 1; j++) {
	// 						if(!jsonData[zkey][arrkeys[j]]) jsonData[zkey][arrkeys[j]] = [];
	// 						jsonData[zkey][arrkeys[j]][i] = Number(values[j]); //for excel .toString().replace('.', ',')
	// 					};
	// 				});
	// 			});
	// 			/*=====  End of Get Data  ======*/
				
	// 			/*----------  Write output files  ----------*/

	// 			if (!fs.existsSync('Output')){
	// 			  fs.mkdirSync('Output');
	// 			}
	// 			// var outfilename = path.dirname(file).match(/\\.+/g).toString().replace('\\', '') + '.csv';
	// 			// var wstream = fs.createWriteStream('Output/'+ outfilename);


	// 			// console.log('writing file - Output/' + outfilename); //Console write step


	// 			var zkeys = Object.keys(jsonData);

	// 			/*===============================================
	// 			=            All table values output            =
	// 			===============================================*/
				
	// 			// zkeys.forEach(function(item1, i1, arr1) {
	// 			// 	var keys = Object.keys(jsonData[item1]);
	// 			// 	wstream.write('"' + item1.toString().replace('.',',') + '"\r\n');
	// 			// 	keys.forEach(function(item2, i2, arr2) {
	// 			// 		wstream.write('"' + item2 + '",');
	// 			// 	});
	// 			// 	wstream.write('\r\n');

	// 			// 	for (var i = 0; i <= jsonData[item1][keys[0]].length - 1; i++) {
	// 			// 		keys.forEach(function(item2, i2, arr2) {
	// 			// 			wstream.write('"=' + jsonData[item1][item2][i] + '",');
	// 			// 		});
	// 			// 		wstream.write('\r\n');
	// 			// 	};
	// 			// 	wstream.write('\r\n');
	// 			// });
	// 			// wstream.end();
				
	// 			/*=====  End of All table values output  ======*/

	// 			/*====================================
	// 			=            Out z-stresses only            =
	// 			====================================*/

	// 			if (!fs.existsSync('Stresses')){
	// 			  fs.mkdirSync('Stresses');
	// 			}
	// 			var outfilename = path.dirname(file).match(/\\.+/g).toString().replace(/_.+abs/, '').replace('\\', 'Szz__') + '.prn';
	// 			var wstream = fs.createWriteStream('Stresses/'+ outfilename);
	// 			console.log('writing stresses file - Output/' + outfilename);
	// 			var lengths = [];
	// 			zkeys.forEach(function(item1, i1, arr1) {
	// 				lengths.push(jsonData[item1]['Szz'].length);
	// 			});
	// 			var mainlength = Math.min.apply(Math, lengths);
	// 			zkeys.forEach(function(item1, i1, arr1) {
	// 				for(var i = 0; i < mainlength; i++) {
	// 					wstream.write(jsonData[item1]['Szz'][i] + ' ');
	// 				}
	// 				wstream.write('\r\n');
	// 			});
				
	// 			wstream.end();

	// 			/*=====  End of Out z-stresses only  ======*/

	// 			/*==================================
	// 			=            Pump Light            =
	// 			==================================*/
	// 			var outfilename = path.dirname(file).match(/\\.+/g).toString().replace(/_.+abs/, '').replace('\\', 'Pump__') + '.prn';
	// 			var wstream = fs.createWriteStream('Stresses/'+ outfilename);
	// 			console.log('writing stresses file - Output/' + outfilename);
	// 			var nullindex = jsonData['0']['x'].indexOf(-2.22045e-16);
	// 			zkeys.forEach(function(item1, i1, arr1) {
	// 				wstream.write(item1 + ' ' + jsonData[item1]['Pump Light'][nullindex] + '\r\n');
	// 			});
	// 			wstream.end();
	// 			/*=====  End of Pump Light  ======*/
				
	// 		});
	// 	});

	var pabs = {};
	files
		.filter(function (file) {
			return path.basename(file) == 'Output.txt' ? 1 : 0;
		})
		.forEach(function(file){
			var pardirname = path.dirname(file).replace(/\w+\\/g, '');
			var conc = Number(pardirname.match(/^\d+\.?\d*/g));
			if(!pabs[conc])	pabs[conc] = [];
			var wp = Number(pardirname.match(/\d+\.?\d*(?=mm)/g));
			// pabs[conc].push(wp);
			var buf = fs.readFileSync(file).toString();
			var p = Number(buf.match(/Totally absorbed pump power = -?\d+\.\d+(?=\s+W)/g).toString().replace('Totally absorbed pump power = ', ''));
			switch(wp){
				case 0.5:
					pabs[conc][0] = p;
					break;
				case 0.8:
					pabs[conc][1] = p;
					break;
				default:
					pabs[conc][2] = p;
					break;
			}
		});
	if (!fs.existsSync('Output')){
	  fs.mkdirSync('Output');
	}
	var outfilename = 'Output/pabs.prn';
	var wstream = fs.createWriteStream(outfilename);
	console.log('writing ' + outfilename);
	Object.keys(pabs).forEach(function(item, i){
		wstream.write(' ' + Number(item));
		pabs[item].forEach(function(elem, i){
			wstream.write(' ' + elem);
		});
		wstream.write('\r\n');
	});
});