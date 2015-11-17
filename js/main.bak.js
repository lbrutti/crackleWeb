$(function(){
	$(window).load(function () {
		// We Get the patch file with an Ajax request, 
		// then load this into a WebPd patch,
		// which we then start.
		var patch;

		var oscillatori = {
			main_osc   : {freq: 100,amt : 1, on : 0},
			mod_osc_01 : {freq: 1, amt : 1, on : 0},
			mod_osc_02 : {freq: 2, amt : 2, on : 0},
			mod_osc_03 : {freq: 3, amt : 3, on : 0},
			mod_osc_04 : {freq: 5, amt : 5, on : 0},
			mod_osc_05 : {freq: 7, amt : 7, on : 0},
			mod_osc_06 : {freq: 11,amt : 11, on : 0}
		};

		$.each(oscillatori,function(k,osc){
			osc['wavetable']=[];
			for (i=0;i<512;i++){
				osc['wavetable'].push(Math.random());
			}
			console.log(osc.wavetable);
		});

		$.get('./patches/crackleWeb_wave.pd', function(patchFile) {
			patch = Pd.compat.parse(patchFile);
			patch.play();
			patch.send('main_osc_freq',parseFloat(440));
			patch.send('main_osc_amt',parseFloat(1));
			patch.send('on_off',1);
		});

		
		var svg=$('#cracklebox');
		var a = document.getElementById("cracklebox");
	    var svgDoc = a.contentDocument; //get the inner DOM of alpha.svg

	    var tasti = $(svgDoc).find('.tasto');
	    
	    $(tasti).click(function(){
	    	var osc_name = $(this).attr('id');
	    	var osc = oscillatori[osc_name];
	    	var waveform = 
	    	console.log(osc)
	    	if(osc.on == 0){
	    		$(this).css('fill','E5DD7F');
	    		var values = [];
	    		for (i=0;i<512;i++){
					values.push(Math.random());
				}
				setWaveForm(values,osc_name);
	    		patch.send(osc_name+'_freq',parseFloat(osc.freq));
				patch.send(osc_name+'_amt',parseFloat(osc.amt));
	    		osc.on = 1;
	    	}
	    	else {
	    		$(this).css('fill','eee');
	    		patch.send(osc_name+'_freq',parseFloat(osc.freq));
				patch.send(osc_name+'_amt',parseFloat(0));
	    		osc.on = 0;
	    	}

	    });

	    $(tasti).on('touchstart',function(e){
	    	e.preventDefault();
	    	var osc_name = $(this).attr('id');
	    	var osc = oscillatori[osc_name];
	    	$(this).css('fill','E5DD7F');
	    	patch.send(osc_name+'_freq',parseFloat(osc.freq));
			patch.send(osc_name+'_amt',parseFloat(osc.amt));
	    	osc.on = 1;		
	    	return false;
	    });

	    $(tasti).on('touchend',function(e){
	    	e.preventDefault();
	    	var osc_name = $(this).attr('id');
	    	var osc = oscillatori[osc_name];
	    	$(this).css('fill','eee');
	    	patch.send(osc_name+'_freq',parseFloat(osc.freq));
			patch.send(osc_name+'_amt',parseFloat(0));
	    	osc.on = 0;		
	    	return false;
	    });
	});
});

function triggerOsc(osc) {
	patch.send(osc_name+'_freq',parseFloat(osc.freq));
	patch.send(osc_name+'_amt',parseFloat(osc.amt));
}

function setWaveForm(values, osc_name){
	var waveform = $.grep(Pd._patches[0]._graph.objects, function(obj){
		return obj.name == osc_name+'_wave'
	});
	console.log(waveform[0].data);
	waveform[0].data=values;
	console.log(waveform[0].data);
}

//recupera array
//