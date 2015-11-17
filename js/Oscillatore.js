//classe OSCILLATORE
function Oscillator (name){
	this.freq = 0.0;
	this.amplitude = 0.0;
	this.waveform = [];
	this.nome = name;


	//metodi accessori
	this.setFreq = function(freq){
		this.freq = freq;
	}
	this.getFreq = function(){
		return this.freq;
	}

	this.setAmplitude = function(amp){
		this.amplitude = amp;
	}
	this.getAmplitude = function(){
		return this.amplitude;
	}

	this.setWaveform = function(wave){
		this.waveform = wave;
	}
	this.getWaveform = function(){
		return this.waveform;
	}

	this.getName = function(){
		return this.nome;
	}
	this.setName = function(name){
		this.nome = name;
	}
}