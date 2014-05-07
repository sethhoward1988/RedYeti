
// Written by Seth Howard
// MIT Licensed

AudioPlayer = function (canvas, player) {
    this.canvas = canvas;
    this.player = player;
    this.init();
}

AudioPlayer.prototype = {

    init: function () {
        this.setBindings();
        this.setEvents();
        this.buildQueue();
        this.play = $(this.player.find('.play'));
        this.pause = $(this.player.find('.pause'));
        this.title = $(this.player.find('.title'));

        this.NUM_PARTICLES = 150;

        this.NUM_BANDS = 128;

        this.SMOOTHING = 0.5;
    },

    setBindings: function () {
        this.onRowClick = _.bind(this.onRowClick, this);
        this.onNextClick = _.bind(this.onNextClick, this);
        this.onPrevClick = _.bind(this.onPrevClick, this);
        this.onPlayClick = _.bind(this.onPlayClick, this);
        this.onPauseClick = _.bind(this.onPauseClick, this);
    },

    setEvents: function () {
        this.player.find('.row').on('click', this.onRowClick);
        this.player.find('.next').on('click', this.onNextClick);
        this.player.find('.prev').on('click', this.onPrevClick);
        this.player.find('.play').on('click', this.onPlayClick);
        this.player.find('.pause').on('click', this.onPauseClick);
    },

    onRowClick: function (evt) {
        var that = this;
        var target = $(evt.target);
        if(target.hasClass('active')){
            return;
        } else {
            var path = $(evt.target).attr('data-src');
            var song = _.find(this.queue, function (song, index) {
                if(song.path == path) {
                    that.currentIndex = index;
                    return true;
                } else {
                    return false;
                }
            });
            this.setSong(song);
        }
    },

    buildQueue: function () {
        this.queue = [];
        var songs = this.player.find('.row');
        for(var i = 0; i < songs.length; i++){
            this.queue.push({
                title: $(songs[i]).text(),
                path: $(songs[i]).attr('data-src'),
                el: $(songs[i])
            });
        }
        this.currentIndex = 0;
    },

    onNextClick: function (evt) {
        if(this.currentIndex == this.queue.length - 1){
            this.currentIndex = -1;
        }
        this.currentIndex++;
        this.setSong(this.queue[this.currentIndex]);
    },

    onPrevClick: function (evt) {
        if(this.currentIndex == 0){
            this.currentIndex = this.queue.length;
        }
        this.currentIndex--
        this.setSong(this.queue[this.currentIndex]);
    },

    onPlayClick: function (evt) {
        if(!this.analyser){
            this.setSong(this.queue[this.currentIndex]);
        } else {
            this.analyser.audio.play();
        }
        this.play.hide();
        this.pause.show();
        this.title.text(this.title.text().replace(' (paused)',''));
    },

    onPauseClick: function (evt) {
        this.analyser.audio.pause()
        this.pause.hide();
        this.play.show();
        this.title.text(this.title.text() + ' (paused)');
    },

    setSong: function (song) {
        if(this.analyser){
            this.analyser.audio.remove();
        }

        this.visualize();

        this.player.find('.row').removeClass('active');

        this.title.text(song.title);

        song.el.addClass('active');

        this.analyser = new AudioAnalyser(song.path, this.NUM_BANDS, this.SMOOTHING);
        
        this.analyser.onUpdate = (function(_this) {
          return function(bands) {
            var _j, _len, _ref1, _results;
            _ref1 = _this.particles;
            _results = [];
            for (_j = 0, _len = _ref1.length; _j < _len; _j++) {
              particle = _ref1[_j];
              _results.push(particle.energy = bands[particle.band] / 256);
            }
            return _results;
          };
        })(this.sketch);

        this.analyser.start();

        document.body.appendChild(this.analyser.audio);
    },

    visualize: function () {
        var that = this;

        if(this.sketch){
            return;
        }

        this.sketch = Sketch.create({
          particles: [],
          setup: function() {
            var error, i, intro, particle, warning, x, y, _i, _ref;
            
            for (i = _i = 0, _ref = that.NUM_PARTICLES - 1; _i <= _ref; i = _i += 1) {
              x = random(this.width);
              y = random(this.height * 2);
              particle = new Particle(x, y);
              particle.energy = random(particle.band / 256);
              this.particles.push(particle);
            }
          },
          draw: function() {
            var particle, _i, _len, _ref, _results;
            this.globalCompositeOperation = 'lighter';
            _ref = this.particles;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              particle = _ref[_i];
              if (particle.y < -particle.size * particle.level * particle.scale * 2) {
                particle.reset();
                particle.x = random(this.width);
                particle.y = this.height + particle.size * particle.scale * particle.level;
              }
              particle.move();
              _results.push(particle.draw(this));
            }
            return _results;
          }
        });

        $('.section.listen').prepend(this.sketch.element);

    }
}


// AUDIO ANALYSER CLASS

AudioAnalyser = (function() {
  AudioAnalyser.AudioContext = self.AudioContext || self.webkitAudioContext;

  AudioAnalyser.enabled = AudioAnalyser.AudioContext != null;

  function AudioAnalyser(audio, numBands, smoothing) {
    var src;
    this.audio = audio != null ? audio : new Audio();
    this.numBands = numBands != null ? numBands : 256;
    this.smoothing = smoothing != null ? smoothing : 0.3;
    if (typeof this.audio === 'string') {
      src = this.audio;
      this.audio = new Audio();
      this.audio.controls = true;
      this.audio.src = src;
    }
    this.context = new AudioAnalyser.AudioContext();
    this.jsNode = this.context.createJavaScriptNode(2048, 1, 1);
    this.analyser = this.context.createAnalyser();
    this.analyser.smoothingTimeConstant = this.smoothing;
    this.analyser.fftSize = this.numBands * 2;
    this.bands = new Uint8Array(this.analyser.frequencyBinCount);
    this.audio.addEventListener('canplay', (function(_this) {
      return function() {
        _this.source = _this.context.createMediaElementSource(_this.audio);
        _this.source.connect(_this.analyser);
        _this.analyser.connect(_this.jsNode);
        _this.jsNode.connect(_this.context.destination);
        _this.source.connect(_this.context.destination);
        return _this.jsNode.onaudioprocess = function() {
          _this.analyser.getByteFrequencyData(_this.bands);
          if (!_this.audio.paused) {
            return typeof _this.onUpdate === "function" ? _this.onUpdate(_this.bands) : void 0;
          }
        };
      };
    })(this));
  }

  AudioAnalyser.prototype.start = function() {
    return this.audio.play();
  };

  AudioAnalyser.prototype.stop = function() {
    return this.audio.pause();
  };

  return AudioAnalyser;

})();

// PARTICLE CLASS

Particle = (function() {

    var NUM_PARTICLES = 150,

        NUM_BANDS = 128,

        SMOOTHING = 0.5,

        SCALE = {
          MIN: 5.0,
          MAX: 80.0
        },

        SPEED = {
          MIN: 0.2,
          MAX: 1.0
        },

        ALPHA = {
          MIN: 0.8,
          MAX: 0.9
        },

        SPIN = {
          MIN: 0.001,
          MAX: 0.005
        },

        SIZE = {
          MIN: 0.5,
          MAX: 1.25
        },

        COLORS = ['#69D2E7', '#1B676B', '#BEF202', '#EBE54D', '#00CDAC', '#1693A5', '#F9D423', '#FF4E50', '#E7204E', '#0CCABA', '#FF006F'];
        COLORS = ['#DCDCDC', '#D3D3D3', '#C0C0C0', '#A9A9A9', '#808080', '#696969', '#778899', '#708090', '#2F4F4F', '#0CCABA'];


    function Particle(x, y) {
        this.x = x != null ? x : 0;
        this.y = y != null ? y : 0;
        this.reset();
    }

    Particle.prototype.reset = function() {
        this.level = 1 + floor(random(4));
        this.scale = random(SCALE.MIN, SCALE.MAX);
        this.alpha = random(ALPHA.MIN, ALPHA.MAX);
        this.speed = random(SPEED.MIN, SPEED.MAX);
        this.color = random(COLORS);
        this.size = random(SIZE.MIN, SIZE.MAX);
        this.spin = random(SPIN.MAX, SPIN.MAX);
        this.band = floor(random(NUM_BANDS));
        if (random() < 0.5) {
          this.spin = -this.spin;
        }
        this.smoothedScale = 0.0;
        this.smoothedAlpha = 0.0;
        this.decayScale = 0.0;
        this.decayAlpha = 0.0;
        this.rotation = random(TWO_PI);
        return this.energy = 0.0;
    };

    Particle.prototype.move = function() {
        this.rotation += this.spin;
        return this.y -= this.speed * this.level;
    };

    Particle.prototype.draw = function(ctx) {
        var alpha, power, scale;
        power = exp(this.energy);
        scale = this.scale * power;
        alpha = this.alpha * this.energy * 1.5;
        this.decayScale = max(this.decayScale, scale);
        this.decayAlpha = max(this.decayAlpha, alpha);
        this.smoothedScale += (this.decayScale - this.smoothedScale) * 0.3;
        this.smoothedAlpha += (this.decayAlpha - this.smoothedAlpha) * 0.3;
        this.decayScale *= 0.985;
        this.decayAlpha *= 0.975;
        ctx.save();
        ctx.beginPath();
        ctx.translate(this.x + cos(this.rotation * this.speed) * 250, this.y);
        ctx.rotate(this.rotation);
        ctx.scale(this.smoothedScale * this.level, this.smoothedScale * this.level);
        ctx.moveTo(this.size * 0.5, 0);
        ctx.lineTo(this.size * -0.5, 0);
        ctx.lineWidth = 1;
        ctx.lineCap = 'round';
        ctx.globalAlpha = this.smoothedAlpha / this.level;
        ctx.strokeStyle = this.color;
        ctx.stroke();
        return ctx.restore();
    };

    return Particle;

})();