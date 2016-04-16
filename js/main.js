$(function(){
	$(window).load(function () {
		// We Get the patch file with an Ajax request, 
		// then load this into a WebPd patch,
		// which we then start.
		var patch;
		var xRate, yRate, zRate;

		if (window.DeviceMotionEvent != undefined) {
			window.ondevicemotion = function(e) {
				xRate = parseInt(event.accelerationIncludingGravity.x * 5);
				yRate = parseInt(event.accelerationIncludingGravity.y * 5);
				zRate = parseInt(event.accelerationIncludingGravity.z * 5);

				Pd.send('volAmt',[scale(yRate,-50,50)]);
				Pd.send('crushAmt',[scale(xRate, 10, 8000)]);
				//console.log('xRate : ', xRate);
				//console.log('yRate : ', yRate);
				//console.log('zRate : ', zRate);
			}
		}

		var oscillatori = {
			main_osc   : {freq: 16000,amt : 1, on : 0},
			mod_osc_01 : {freq: Math.random()*100, amt : 10, on : 0},
			mod_osc_02 : {freq: Math.random()*100, amt : 10, on : 0},
			mod_osc_03 : {freq: Math.random()*100, amt : 10, on : 0},
			mod_osc_04 : {freq: Math.random()*100, amt : 10, on : 0},
			mod_osc_05 : {freq: Math.random()*100, amt : 10, on : 0},
			mod_osc_06 : {freq: Math.random()*100,amt : 10, on : 0}
		};

		var mainOsc = new Oscillator('main_osc');
		
		$.each(oscillatori,function(k,osc){
			osc['wavetable']=[];
			for (i=0;i<512;i++){
				osc['wavetable'].push(Math.random()*100);

			}
			mainOsc.setWaveform(osc['wavetable']);
		});

		$.get('./patches/crackleWeb_wave_with_master.pd', function(patchFile) {
			patch = Pd.loadPatch(patchFile);
			Pd.start();
			Pd.send('main_osc_freq',[parseFloat(5000)]);
			Pd.send('main_osc_amt',[parseFloat(1)]);
			Pd.send('on_off',[0]);
		});

		
		var svg=$('#cracklebox');
		var a = document.getElementById("cracklebox");
	    var svgDoc = a.contentDocument; //get the inner DOM of alpha.svg

	    var tasti = $(svgDoc).find('.tasto');
	    
	    $(tasti).click(function(oEvent){
	    	oEvent.preventDefault();
	    	var osc_name = $(this).attr('id');
	    	var osc = oscillatori[osc_name];
	    	var waveform = [];
	    	if(osc.on == 0){
	    		$(this).css('fill','E5DD7F');
				setRandomOsc(osc);
		    	turnOnOsc(osc);
		    	sendToPatchOsc(osc_name, osc);
				
	    	}
	    	else {
	    		$(this).css('fill','eee');
	    		turnOffOsc(osc);
		    	sendToPatchOsc(osc_name, osc);
	    		
	    	}
	    	return false;

	    });

	    $(tasti).on('touchstart',function(e){
	    	e.preventDefault();
	    	var osc_name = $(this).attr('id');
	    	var osc = oscillatori[osc_name];
	    	$(this).css('fill','E5DD7F');
	    	setRandomOsc(osc);
	    	turnOnOsc(osc);
	    	sendToPatchOsc(osc_name, osc);
	    	return false;
	    });

	    $(tasti).on('touchend',function(e){
	    	e.preventDefault();
	    	var osc_name = $(this).attr('id');
	    	var osc = oscillatori[osc_name];
	    	$(this).css('fill','eee');
	    	turnOffOsc(osc);
	    	sendToPatchOsc(osc_name, osc);
	    	return false;
	    });
	});
});

function turnOnOsc(osc){
	osc.on = 1;
}

function turnOffOsc(osc){
	osc.on = 0;
}

function sendToPatchOsc(osc_name, osc) {
	Pd.send(osc_name+'_freq',[parseFloat(osc.freq)]);
	Pd.send(osc_name+'_amt',[parseFloat(osc.amt)]);
	Pd.send(osc_name+'_on',[parseFloat(osc.on)]);
}

function setWaveForm(values, osc_name){
	var waveform = $.grep(Pd._patches[0]._graph.objects, function(obj){
		return obj.name == osc_name+'_wave'
	});
	waveform[0].data=values;
}

function setRandomOsc (osc){
	osc.freq = Math.random()*10;
	osc.amt = Math.random()*10;
}

function scale (val,min, max){
	return (val - min) / (max - min);
}
//recupera array
//
