!
function(t, e, n) {
  "use strict";

  function i(t) {
    t && (t.setTargetAtTime || (t.setTargetAtTime = t.setTargetValueAtTime))
  }
  window.hasOwnProperty("webkitAudioContext") && !window.hasOwnProperty("AudioContext") && (window.AudioContext = webkitAudioContext, AudioContext.prototype.hasOwnProperty("createGain") || (AudioContext.prototype.createGain = AudioContext.prototype.createGainNode), AudioContext.prototype.hasOwnProperty("createDelay") || (AudioContext.prototype.createDelay = AudioContext.prototype.createDelayNode), AudioContext.prototype.hasOwnProperty("createScriptProcessor") || (AudioContext.prototype.createScriptProcessor = AudioContext.prototype.createJavaScriptNode), AudioContext.prototype.hasOwnProperty("createPeriodicWave") || (AudioContext.prototype.createPeriodicWave = AudioContext.prototype.createWaveTable), AudioContext.prototype.internal_createGain = AudioContext.prototype.createGain, AudioContext.prototype.createGain = function() {
    var t = this.internal_createGain();
    return i(t.gain), t
  }, AudioContext.prototype.internal_createDelay = AudioContext.prototype.createDelay, AudioContext.prototype.createDelay = function(t) {
    var e = t ? this.internal_createDelay(t) : this.internal_createDelay();
    return i(e.delayTime), e
  }, AudioContext.prototype.internal_createBufferSource = AudioContext.prototype.createBufferSource, AudioContext.prototype.createBufferSource = function() {
    var t = this.internal_createBufferSource();
    return t.start ? (t.internal_start = t.start, t.start = function(e, n, i) {
      "undefined" != typeof i ? t.internal_start(e || 0, n, i) : t.internal_start(e || 0, n || 0)
    }) : t.start = function(t, e, n) {
      e || n ? this.noteGrainOn(t || 0, e, n) : this.noteOn(t || 0)
    }, t.stop ? (t.internal_stop = t.stop, t.stop = function(e) {
      t.internal_stop(e || 0)
    }) : t.stop = function(t) {
      this.noteOff(t || 0)
    }, i(t.playbackRate), t
  }, AudioContext.prototype.internal_createDynamicsCompressor = AudioContext.prototype.createDynamicsCompressor, AudioContext.prototype.createDynamicsCompressor = function() {
    var t = this.internal_createDynamicsCompressor();
    return i(t.threshold), i(t.knee), i(t.ratio), i(t.reduction), i(t.attack), i(t.release), t
  }, AudioContext.prototype.internal_createBiquadFilter = AudioContext.prototype.createBiquadFilter, AudioContext.prototype.createBiquadFilter = function() {
    var t = this.internal_createBiquadFilter();
    return i(t.frequency), i(t.detune), i(t.Q), i(t.gain), t
  }, AudioContext.prototype.hasOwnProperty("createOscillator") && (AudioContext.prototype.internal_createOscillator = AudioContext.prototype.createOscillator, AudioContext.prototype.createOscillator = function() {
    var t = this.internal_createOscillator();
    return t.start ? (t.internal_start = t.start, t.start = function(e) {
      t.internal_start(e || 0)
    }) : t.start = function(t) {
      this.noteOn(t || 0)
    }, t.stop ? (t.internal_stop = t.stop, t.stop = function(e) {
      t.internal_stop(e || 0)
    }) : t.stop = function(t) {
      this.noteOff(t || 0)
    }, t.setPeriodicWave || (t.setPeriodicWave = t.setWaveTable), i(t.frequency), i(t.detune), t
  })), window.hasOwnProperty("webkitOfflineAudioContext") && !window.hasOwnProperty("OfflineAudioContext") && (window.OfflineAudioContext = webkitOfflineAudioContext)
}(window), function t(e, n, i) {
  function o(r, a) {
    if (!n[r]) {
      if (!e[r]) {
        var u = "function" == typeof require && require;
        if (!a && u) return u(r, !0);
        if (s) return s(r, !0);
        var c = new Error("Cannot find module '" + r + "'");
        throw c.code = "MODULE_NOT_FOUND", c
      }
      var l = n[r] = {
        exports: {}
      };
      e[r][0].call(l.exports, function(t) {
        var n = e[r][1][t];
        return o(n ? n : t)
      }, l, l.exports, t, e, n, i)
    }
    return n[r].exports
  }
  for (var s = "function" == typeof require && require, r = 0; r < i.length; r++) o(i[r]);
  return o
}({
  1: [function(t, e, n) {
    var i = t("underscore"),
        o = t("pd-fileutils.parser"),
        s = t("./lib/core/Patch"),
        r = t("./lib/core/PdObject"),
        a = t("./lib/core/mixins"),
        u = t("./lib/waa/portlets"),
        c = t("./lib/waa/interfaces"),
        l = t("./lib/global"),
        h = t("./lib/core/interfaces"),
        f = i.extend({}, a.UniqueIdsMixin);
    t("./lib/index").declareObjects(l.library);
    var d = e.exports = {
      start: function(t) {
        if (t = t || {}, !l.isStarted) {
          "undefined" != typeof AudioContext ? (l.audio = t.audio || new c.Audio({
            channelCount: l.settings.channelCount,
            audioContext: t.audioContext
          }), l.clock = t.clock || new c.Clock({
            audioContext: l.audio.context,
            waaClock: t.waaClock
          })) : (l.audio = t.audio || h.Audio, l.clock = t.clock || h.Clock), l.storage = t.storage ? t.storage : "undefined" != typeof window ? new c.Storage : h.Storage, l.audio.start();
          for (var e in l.patches) l.patches[e].start();
          l.isStarted = !0
        }
      },
      stop: function() {
        if (l.isStarted) {
          l.isStarted = !1;
          for (var t in l.patches) l.patches[t].stop();
          l.audio.stop()
        }
      },
      isStarted: function() {
        return l.isStarted
      },
      getAudio: function() {
        return l.audio
      },
      send: function(t, e) {
        l.emitter.emit("msg:" + t, e)
      },
      receive: function(t, e) {
        l.emitter.on("msg:" + t, e)
      },
      registerAbstraction: function(t, e) {
        i.isString(e) && (e = o.parse(e));
        var n = function(t, n, i) {
          var t = new s(t, n, i);
          return t.patchId = f._generateId(), d._preparePatch(t, e), t
        };
        n.prototype = s.prototype, this.registerExternal(t, n)
      },
      registerExternal: function(t, e) {
        l.library[t] = e
      },
      createPatch: function() {
        var t = this._createPatch();
        return l.isStarted && t.start(), t
      },
      destroyPatch: function(t) {
        t.stop(), t.destroy(), delete l.patches[t.patchId]
      },
      loadPatch: function(t) {
        var e = this._createPatch();
        return i.isString(t) && (t = o.parse(t)), this._preparePatch(e, t), l.isStarted && e.start(), e
      },
      _createPatch: function() {
        var t = new s;
        return t.patchId = f._generateId(), l.patches[t.patchId] = t, t
      },
      _preparePatch: function(t, e) {
        var n = {};
        e.nodes.forEach(function(e) {
          var i, o = e.proto;
          if ("graph" === o) {
            var s = e.subpatch.nodes[0];
            i = t._createObject("array", s.args || []), i.setData(new Float32Array(s.data), !0), o = "array"
          } else i = t._createObject(o, e.args || []);
          "pd" === o && d._preparePatch(i, e.subpatch), n[e.id] = i
        }), e.connections.forEach(function(t) {
          var e = n[t.source.id],
              i = n[t.sink.id];
          if (!e || !i) throw new Error("invalid connection");
          e.o(t.source.port).connect(i.i(t.sink.port))
        })
      },
      core: {
        PdObject: r,
        portlets: u
      },
      _glob: l
    };
    "undefined" != typeof window && (window.Pd = d)
  }, {
    "./lib/core/Patch": 4,
    "./lib/core/PdObject": 5,
    "./lib/core/interfaces": 6,
    "./lib/core/mixins": 7,
    "./lib/global": 10,
    "./lib/index": 12,
    "./lib/waa/interfaces": 14,
    "./lib/waa/portlets": 15,
    "pd-fileutils.parser": 21,
    underscore: 22
  }],
  2: [function(t, e, n) {
    var i = (t("events").EventEmitter, t("underscore")),
        o = t("./core/utils"),
        s = t("./core/mixins"),
        r = t("./core/PdObject"),
        a = (t("./core/Patch"), t("./global")),
        u = t("./waa/portlets");
    n.declareObjects = function(t) {
      var e = r.extend({
        inletDefs: [u.Inlet.extend({
          message: function(t) {
            this.obj._onMessageReceived(t)
          }
        })],
        outletDefs: [u.Outlet],
        init: function(t, e, n, i, o) {
          if (this._eventReceiver = new s.EventReceiver, this.value = n ? o : i, t && "-" !== t && "empty" !== t && (this.receiveName = t, this._onMessageReceived && (this._onMessageReceived = this._onMessageReceived.bind(this), this._eventReceiver.on(a.emitter, "msg:" + this.receiveName, this._onMessageReceived))), e && "-" !== e && "empty" !== e && (this.sendName = e), n && this.patch) {
            var r = this;
            this._onPatchStarted = function() {
              r._sendMessage([r.value])
            }, this._eventReceiver.on(this.patch, "started", this._onPatchStarted)
          }
        },
        destroy: function() {
          this._eventReceiver.destroy()
        },
        _sendMessage: function(t) {
          this.o(0).message(t), this.sendName && a.emitter.emit("msg:" + this.sendName, t)
        }
      });
      t.symbolatom = e.extend({
        type: "symbolatom",
        init: function(t) {
          var n = (t[0] || void 0, t[1] || void 0, t[2]),
              i = t[3];
          e.prototype.init.apply(this, [n, i, 0, "symbol", 0])
        },
        _onMessageReceived: function(t) {
          var e = t[0];
          return "bang" === e || i.isNumber(e) || "symbol" === e ? (i.isNumber(e) ? this.value = "float" : "symbol" === e && (this.value = t[1]), void this._sendMessage(o.timeTag(["symbol", this.value], t))) : console.error("invalid " + e)
        }
      });
      var n = e.extend({
        init: function(t, n, o, s, r, a) {
          this._limitInput = function(t) {
            return i.isNumber(r) && (t = Math.min(t, r)), i.isNumber(s) && (t = Math.max(t, s)), t
          }, e.prototype.init.apply(this, [n, o, t, 0, a])
        },
        _onMessageReceived: function(t) {
          var e = t[0];
          return "bang" === e || i.isNumber(e) ? (i.isNumber(e) && (this.value = e), void this._sendMessage(o.timeTag([this._limitInput(this.value)], t))) : console.error("invalid " + e)
        }
      });
      t.floatatom = n.extend({
        type: "floatatom",
        init: function(t) {
          var e = t[0] || void 0,
              i = t[1] || void 0,
              o = t[2],
              s = t[3];
          n.prototype.init.apply(this, [0, o, s, e, i, 0])
        }
      }), t.nbx = n.extend({
        type: "nbx",
        init: function(t) {
          var e = t[0] || void 0,
              i = t[1] || void 0,
              o = t[2] || 0,
              s = t[3],
              r = t[4],
              a = t[5] || 0;
          n.prototype.init.apply(this, [o, s, r, e, i, a])
        }
      }), t.bng = e.extend({
        type: "bng",
        init: function(t) {
          var n = t[0] || 0,
              i = t[1],
              o = t[2];
          e.prototype.init.apply(this, [i, o, n, "bang", "bang"])
        },
        _onMessageReceived: function(t) {
          this._sendMessage(o.timeTag(["bang"], t))
        }
      }), t.tgl = e.extend({
        type: "tgl",
        init: function(t) {
          var n = t[0] || 0,
              o = t[1],
              s = t[2],
              r = t[3] || 0,
              a = i.isNumber(t[4]) ? t[4] : 1;
          e.prototype.init.apply(this, [o, s, n, 0, r]), this.nonZeroValue = a
        },
        _onMessageReceived: function(t) {
          var e = t[0];
          if ("bang" === e) this.value = 0 === this.value ? this.nonZeroValue : 0, this._sendMessage(o.timeTag([this.value], t));
          else {
            if (!i.isNumber(e)) return console.error("invalid message received " + t);
            this.value = 0 === e ? 0 : this.nonZeroValue, this._sendMessage(o.timeTag([e], t))
          }
        }
      });
      var c = n.extend({
        init: function(t) {
          var e = t[0] || 0,
              o = i.isNumber(t[1]) ? t[1] : 127,
              s = t[2] || 0,
              r = t[3],
              a = t[4],
              u = t[5] || 0;
          n.prototype.init.apply(this, [s, r, a, e, o, u])
        }
      });
      t.hsl = c.extend({
        type: "hsl"
      }), t.vsl = c.extend({
        type: "vsl"
      });
      var l = e.extend({
        init: function(t) {
          var n = (t[0], t[1]),
              o = i.isNumber(t[2]) ? t[2] : 8,
              s = t[3],
              r = t[4],
              a = t[5] || 0;
          this._limitInput = function(t) {
            return Math.floor(Math.min(Math.max(t, 0), o - 1))
          }, e.prototype.init.apply(this, [s, r, n, 0, a])
        },
        _onMessageReceived: function(t) {
          var e = t[0];
          return "bang" === e || i.isNumber(e) ? (i.isNumber(e) && (this.value = e), void this._sendMessage(o.timeTag([this._limitInput(this.value)], t))) : console.error("invalid " + e)
        }
      });
      t.hradio = l.extend({
        type: "hradio"
      }), t.vradio = l.extend({
        type: "vradio"
      }), t.vu = e.extend({
        init: function(t) {
          var n = t[0];
          e.prototype.init.apply(this, [n, void 0, 0, 0, 0])
        },
        _onMessageReceived: function(t) {
          this._sendMessage(t)
        }
      })
    }
  }, {
    "./core/Patch": 4,
    "./core/PdObject": 5,
    "./core/mixins": 7,
    "./core/utils": 9,
    "./global": 10,
    "./waa/portlets": 15,
    events: 16,
    underscore: 22
  }],
  3: [function(t, e, n) {
    var i = t("underscore"),
        o = (t("util").inherits, t("./portlets"), t("./utils"), e.exports = function(t, e, n) {
        n = n || [];
        var i = this;
        this.id = e, this.patch = t, this.inlets = this.inletDefs.map(function(t, e) {
          return new t(i, e)
        }), this.outlets = this.outletDefs.map(function(t, e) {
          return new t(i, e)
        }), this.init(n)
      });
    i.extend(o.prototype, {
      endPoint: !1,
      doResolveArgs: !1,
      outletDefs: [],
      inletDefs: [],
      init: function() {},
      start: function() {},
      stop: function() {},
      destroy: function() {},
      i: function(t) {
        if (t < this.inlets.length) return this.inlets[t];
        throw new Error("invalid inlet " + t)
      },
      o: function(t) {
        if (t < this.outlets.length) return this.outlets[t];
        throw new Error("invalid outlet " + t)
      },
      startPortlets: function() {
        this.outlets.forEach(function(t) {
          t.start()
        }), this.inlets.forEach(function(t) {
          t.start()
        })
      },
      stopPortlets: function() {
        this.outlets.forEach(function(t) {
          t.stop()
        }), this.inlets.forEach(function(t) {
          t.stop()
        })
      }
    })
  }, {
    "./portlets": 8,
    "./utils": 9,
    underscore: 22,
    util: 20
  }],
  4: [function(t, e, n) {
    var i = t("underscore"),
        o = t("events").EventEmitter,
        s = t("./mixins"),
        r = t("./utils"),
        a = t("./BaseNode"),
        u = t("../global"),
        c = e.exports = function() {
        a.apply(this, arguments), this.objects = [], this.endPoints = [], this.patchId = null, this.blockSize = u.settings.blockSize
        };
    i.extend(c.prototype, a.prototype, s.UniqueIdsMixin, o.prototype, {
      type: "patch",
      init: function(t) {
        this.args = t
      },
      start: function() {
        this._startStopGeneric("start", "startPortlets", "started")
      },
      stop: function() {
        this._startStopGeneric("stop", "stopPortlets", "stopped")
      },
      destroy: function() {
        this.objects.forEach(function(t) {
          t.destroy()
        })
      },
      _startStopGeneric: function(t, e, n) {
        var i = function(e) {
          e instanceof c ? (o.push(e), e.objects.forEach(i)) : e[t]()
        },
            o = [this];
        this.objects.forEach(i), o.forEach(function(t) {
          t.objects.forEach(function(t) {
            t instanceof c || t[e]()
          })
        }), o.forEach(function(t) {
          t.emit(n)
        })
      },
      createObject: function(t, e) {
        var n = this._createObject(t, e);
        return u.isStarted && (n.start(), n.startPortlets()), n
      },
      _createObject: function(t, e) {
        var n;
        if (e = e || [], !u.library.hasOwnProperty(t)) throw new Error("unknown object " + t);
        var i = u.library[t];
        return i.prototype.doResolveArgs && (e = this.resolveArgs(e)), n = new i(this, this._generateId(), e), this.objects[n.id] = n, n.endPoint && this.endPoints.push(n), l(n) && this.inlets.push(n.inlets[0]), h(n) && this.outlets.push(n.outlets[0]), n
      },
      resolveArgs: function(t) {
        var e, n = t.slice(0),
            i = this.getPatchRoot().patchId;
        return e = [i].concat(this.args), t.forEach(function(t, e) {
          "b" === t ? n[e] = "bang" : "f" === t ? n[e] = "float" : "s" === t ? n[e] = "symbol" : "a" === t ? n[e] = "anything" : "l" === t && (n[e] = "list")
        }), r.getDollarResolver(n)(e)
      },
      getPatchRoot: function() {
        for (var t = this; t.patch;) t = t.patch;
        return t
      }
    });
    var l = function(t) {
      return [u.library.inlet, u.library["inlet~"]].some(function(e) {
        return t instanceof e
      })
    },
        h = function(t) {
        return [u.library.outlet, u.library["outlet~"]].some(function(e) {
          return t instanceof e
        })
        }
  }, {
    "../global": 10,
    "./BaseNode": 3,
    "./mixins": 7,
    "./utils": 9,
    events: 16,
    underscore: 22
  }],
  5: [function(t, e, n) {
    var i = t("underscore"),
        o = (t("util").inherits, t("./portlets"), t("./utils")),
        s = t("./BaseNode"),
        r = (t("./Patch"), t("../global"), e.exports = function() {
        s.apply(this, arguments)
      });
    r.extend = o.chainExtend, i.extend(r.prototype, s.prototype, {
      doResolveArgs: !0
    })
  }, {
    "../global": 10,
    "./BaseNode": 3,
    "./Patch": 4,
    "./portlets": 8,
    "./utils": 9,
    underscore: 22,
    util: 20
  }],
  6: [function(t, e, n) {
    n.Clock = {
      time: 0,
      schedule: function(t, e, n) {},
      unschedule: function(t) {}
    }, n.Audio = {
      sampleRate: 44100,
      start: function() {},
      stop: function() {},
      decode: function(t, e) {
        e(null, t)
      }
    }, n.Storage = {
      get: function(t, e) {}
    }
  }, {}],
  7: [function(t, e, n) {
    var i = t("events").EventEmitter,
        o = t("underscore"),
        s = t("../global");
    n.NamedMixin = {
      nameIsUnique: !1,
      setName: function(t) {
        if (!o.isString(t)) return console.error("expected [" + this.type + "] name to be a string, got " + t);
        var e = this.name;
        this.emit("changing:name", e, t), this.name = t, s.namedObjects.register(this, this.type, t, this.nameIsUnique, e), this.emit("changed:name", e, t)
      },
      destroy: function() {
        s.namedObjects.unregister(this, this.type, this.name)
      }
    };
    var r = n.EventEmitterMixin = o.extend({}, i.prototype, {
      destroy: function() {
        this.removeAllListeners()
      }
    }),
        a = n.Reference = function(t) {
        this.referencedType = t, this._onNewObject = null, this._onChangedName = null, this.resolved = null, this._eventName = "namedObjects:registered:" + this.referencedType, this._eventReceiver = new u
        };
    o.extend(a.prototype, r, {
      set: function(t) {
        var e = this,
            n = s.namedObjects.get(this.referencedType, t)[0];
        this.name = t, this._stopListening(), n ? this._setResolved(n) : (this._setResolved(null), this._onNewObject = function(n) {
          n.name === t && (e._stopListening(), e._setResolved(n))
        }, this._eventReceiver.on(s.emitter, this._eventName, this._onNewObject))
      },
      destroy: function() {
        this._eventReceiver.destroy(), r.destroy.apply(this)
      },
      _setResolved: function(t) {
        var e = this,
            n = this.resolved;
        this.resolved = t, n && n.removeListener("changing:name", e._onChangedName), t && (this._onChangedName = function() {
          e._setResolved(null)
        }, this._eventReceiver.on(t, "changing:name", this._onChangedName)), this.emit("changed", t, n)
      },
      _stopListening: function() {
        this._onNewObject && (this._eventReceiver.removeListener(s.emitter, this._eventName, this._onNewObject), this._onNewObject = null)
      }
    }), n.UniqueIdsMixin = {
      _generateId: function() {
        return this._idCounter++, this._idCounter
      },
      _idCounter: -1
    };
    var u = n.EventReceiver = function() {
      this._handlers = []
    };
    o.extend(u.prototype, {
      addListener: function(t, e, n) {
        this._handlers.push([t, e, n]), t.addListener(e, n)
      },
      once: function(t, e, n) {
        var i = [t, e, n];
        this._handlers.push(i), t.once(e, n)
      },
      removeListener: function(t, e, n) {
        this._handlers = o.reject(this._handlers, function(i) {
          var o = i[0] === t && i[1] === e && i[2] === n;
          return o && t.removeListener(e, n), o
        })
      },
      destroy: function() {
        this._handlers.forEach(function(t) {
          t[0].removeListener(t[1], t[2])
        }), this._handlers = []
      }
    }), u.prototype.on = u.prototype.addListener
  }, {
    "../global": 10,
    events: 16,
    underscore: 22
  }],
  8: [function(t, e, n) {
    var i = t("underscore"),
        o = t("./utils"),
        s = n.Portlet = function(t, e) {
        this.obj = t, this.id = e, this.connections = [], this.init()
        };
    i.extend(s.prototype, {
      crossPatch: !1,
      init: function() {},
      start: function() {},
      stop: function() {},
      message: function(t) {},
      connection: function(t) {},
      disconnection: function(t) {},
      connect: function(t) {
        if (-1 !== this.connections.indexOf(t)) return !1;
        if (!this.crossPatch && !t.crossPatch && this.obj.patch !== t.obj.patch) throw new Error("cannot connect objects that belong to different patches");
        return this.connections.push(t), t.connect(this), this.connection(t), !0
      },
      disconnect: function(t) {
        var e = this.connections.indexOf(t);
        return -1 === e ? !1 : (this.connections.splice(e, 1), t.disconnect(this), this.disconnection(t), !0)
      }
    }), s.extend = o.chainExtend;
    n.Inlet = s.extend({}), n.Outlet = s.extend({})
  }, {
    "./utils": 9,
    underscore: 22
  }],
  9: [function(t, e, n) {
    var i = t("underscore"),
        o = t("../global"),
        s = /\$(\d+)/,
        r = /\$(\d+)/g;
    n.getDollarResolver = function(t) {
      t = t.slice(0);
      var e = function(t, e) {
        if (e >= t.length || 0 > e) throw new Error("$" + (e + 1) + ": argument number out of range");
        return t[e]
      },
          n = t.map(function(t) {
          var n = s.exec(t);
          return n && n[0] === t ?
          function(t) {
            var i = parseInt(n[1], 10);
            return function(t) {
              return e(t, i)
            }
          }(t) : n ?
          function(t) {
            for (var n, i = []; n = r.exec(t);) i.push([n[0], parseInt(n[1], 10)]);
            return function(n) {
              var o = t.substr(0);
              return i.forEach(function(t) {
                o = o.replace(t[0], e(n, t[1]))
              }), o
            }
          }(t) : function(t) {
            return function() {
              return t
            }
          }(t)
        });
      return function(t) {
        return n.map(function(e, n) {
          return e(t)
        })
      }
    }, n.chainExtend = function() {
      var t = Array.prototype.slice.call(arguments, 0),
          e = this,
          n = function() {
          e.apply(this, arguments)
          };
      return n.prototype = new e, i.extend.apply(this, [n.prototype, e.prototype].concat(t)), n.extend = this.extend, n
    }, n.timeTag = function(t, e) {
      return e ? (t.timeTag = i.isNumber(e) ? e : e.timeTag, t) : t
    }, n.getTimeTag = function(t) {
      return t && t.timeTag || o.clock && o.clock.time || 0
    }
  }, {
    "../global": 10,
    underscore: 22
  }],
  10: [function(t, e, n) {
    var i = t("underscore"),
        o = t("events").EventEmitter;
    n.settings = {
      blockSize: 16384,
      channelCount: 2
    }, n.isStarted = !1;
    var s = n.emitter = new o;
    s.emit = function(t) {
      if (!i.contains([], t) && 0 !== t.indexOf("msg:") && 0 !== t.indexOf("namedObjects:registered") && 0 !== t.indexOf("namedObjects:unregistered")) throw new Error("unknown event : " + t);
      o.prototype.emit.apply(this, arguments)
    }, n.library = {}, n.patches = {}, n.audio = null, n.clock = null, n.storage = null, n.namedObjects = {
      register: function(t, e, i, o, s) {
        var r, a;
        if (this._store[e] = r = this._store[e] || {}, r[i] = a = r[i] || [], -1 === a.indexOf(t)) {
          if (o && a.length > 0) throw new Error("there is already a " + e + ' with name "' + i + '"');
          a.push(t)
        }
        s && (a = r[s], a.splice(a.indexOf(t), 1)), n.emitter.emit("namedObjects:registered:" + e, t)
      },
      unregister: function(t, e, i) {
        var o, s = this._store[e],
            r = s ? s[i] : null;
        r && (o = r.indexOf(t), -1 !== o && (r.splice(o, 1), n.emitter.emit("namedObjects:unregistered:" + e, t)))
      },
      get: function(t, e) {
        return (this._store[t] || {})[e] || []
      },
      reset: function() {
        this._store = {}
      },
      _store: {}
    }
  }, {
    events: 16,
    underscore: 22
  }],
  11: [function(t, e, n) {
    var i = t("underscore"),
        o = t("./core/utils"),
        s = t("./core/mixins"),
        r = t("./core/PdObject"),
        a = t("./core/Patch"),
        u = t("./global"),
        c = t("./waa/portlets");
    n.declareObjects = function(t) {
      t.receive = t.r = r.extend(s.NamedMixin, s.EventEmitterMixin, {
        type: "receive",
        outletDefs: [c.Outlet],
        abbreviations: ["r"],
        init: function(t) {
          var e = t[0],
              n = this;
          this._eventReceiver = new s.EventReceiver, this._onMessageReceived = this._onMessageReceived.bind(this), this._eventReceiver.on(this, "changed:name", function(t, e) {
            t && n._eventReceiver.removeListener(u.emitter, "msg:" + t, n._onMessageReceived), n._eventReceiver.on(u.emitter, "msg:" + e, n._onMessageReceived)
          }), this.setName(e)
        },
        destroy: function() {
          s.NamedMixin.destroy.apply(this, arguments), this._eventReceiver.destroy(), s.EventEmitterMixin.destroy.apply(this, arguments)
        },
        _onMessageReceived: function(t) {
          this.o(0).message(t)
        }
      }), t.send = t.s = r.extend(s.NamedMixin, s.EventEmitterMixin, {
        type: "send",
        inletDefs: [c.Inlet.extend({
          message: function(t) {
            u.emitter.emit("msg:" + this.obj.name, t)
          }
        })],
        abbreviations: ["s"],
        init: function(t) {
          this.setName(t[0])
        },
        destroy: function() {
          s.NamedMixin.destroy.apply(this, arguments), s.EventEmitterMixin.destroy.apply(this, arguments)
        }
      }), t.msg = r.extend({
        type: "msg",
        doResolveArgs: !1,
        inletDefs: [c.Inlet.extend({
          message: function(t) {
            var e = t.timeTag;
            t = t.slice(0), t.unshift(0), this.obj.outlets[0].message(o.timeTag(this.obj.resolver(t), e))
          }
        })],
        outletDefs: [c.Outlet],
        init: function(t) {
          this.resolver = o.getDollarResolver(t)
        }
      }), t.print = r.extend({
        type: "print",
        inletDefs: [c.Inlet.extend({
          message: function(t) {
            console.log(this.obj.prefix ? [this.obj.prefix].concat(t) : t)
          }
        })],
        init: function(t) {
          this.prefix = t[0] || "print"
        }
      }), t.text = r.extend({
        type: "text",
        init: function(t) {
          this.text = t[0]
        }
      }), t.loadbang = r.extend({
        type: "loadbang",
        outletDefs: [c.Outlet],
        init: function() {
          var t = this;
          this._eventReceiver = new s.EventReceiver, this._onPatchStarted = function() {
            t.o(0).message(["bang"])
          }, this._eventReceiver.on(this.patch, "started", this._onPatchStarted)
        },
        destroy: function() {
          this._eventReceiver.destroy()
        }
      });
      var e = r.extend({
        inletDefs: [c.Inlet.extend({
          message: function(t) {
            var e = t[0];
            "bang" !== e && this.obj.setVal(e), this.obj.o(0).message(o.timeTag([this.obj.val], t))
          }
        }), c.Inlet.extend({
          message: function(t) {
            var e = t[0];
            this.obj.setVal(e)
          }
        })],
        outletDefs: [c.Outlet],
        init: function(t) {
          var e = t[0];
          this.setVal(e || 0)
        },
        setVal: function(t) {
          this.val = t
        }
      });
      t["float"] = t.f = e.extend({
        type: "float",
        setVal: function(t) {
          return i.isNumber(t) ? void(this.val = t) : console.error("invalid [float] value " + t)
        }
      }), t["int"] = t.i = e.extend({
        type: "int",
        setVal: function(t) {
          return i.isNumber(t) ? void(this.val = Math.floor(t)) : console.error("invalid [int] value " + t)
        }
      });
      var n = r.extend({
        inletDefs: [c.Inlet.extend({
          message: function(t) {
            var e = t[0];
            i.isNumber(e) ? this.obj.valLeft = e : "bang" !== e && console.error("invalid message : " + t), this.obj.o(0).message(o.timeTag([this.obj.compute()], t))
          }
        }), c.Inlet.extend({
          message: function(t) {
            var e = t[0];
            return i.isNumber(e) ? void(this.obj.valRight = e) : console.error("invalid operand for [" + this.obj.type + "] " + e)
          }
        })],
        outletDefs: [c.Outlet],
        init: function(t) {
          this.valRight = t[0] || 0, this.valLeft = 0
        },
        compute: function() {}
      });
      t["+"] = n.extend({
        type: "+",
        compute: function() {
          return this.valLeft + this.valRight
        }
      }), t["-"] = n.extend({
        type: "-",
        compute: function() {
          return this.valLeft - this.valRight
        }
      }), t["*"] = n.extend({
        type: "*",
        compute: function() {
          return this.valLeft * this.valRight
        }
      }), t["/"] = n.extend({
        type: "/",
        compute: function() {
          return this.valLeft / this.valRight
        }
      }), t.mod = t["%"] = n.extend({
        type: "mod",
        compute: function() {
          return this.valLeft % this.valRight
        }
      }), t.pow = n.extend({
        type: "pow",
        compute: function() {
          return Math.pow(this.valLeft, this.valRight)
        }
      });
      var l = r.extend({
        inletDefs: [c.Inlet.extend({
          message: function(t) {
            var e = t[0];
            this.obj.checkInput(e), this.obj.o(0).message(o.timeTag([this.obj.compute(e)], t))
          }
        })],
        outletDefs: [c.Outlet],
        checkInput: function(t) {},
        compute: function() {}
      }),
          h = l.extend({
          checkInput: function(t) {
            return i.isNumber(t) ? void 0 : console.error("invalid [" + this.type + "] value " + t)
          }
        });
      t.cos = h.extend({
        type: "cos",
        compute: function(t) {
          return Math.cos(t)
        }
      }), t.sin = h.extend({
        type: "sin",
        compute: function(t) {
          return Math.sin(t)
        }
      }), t.tan = h.extend({
        type: "tan",
        compute: function(t) {
          return Math.tan(t)
        }
      }), t.atan = h.extend({
        type: "atan",
        compute: function(t) {
          return Math.atan(t)
        }
      }), t.exp = h.extend({
        type: "exp",
        compute: function(t) {
          return Math.exp(t)
        }
      }), t.log = h.extend({
        type: "log",
        compute: function(t) {
          return Math.log(t)
        }
      }), t.abs = h.extend({
        type: "abs",
        compute: function(t) {
          return Math.abs(t)
        }
      }), t.sqrt = h.extend({
        type: "sqrt",
        compute: function(t) {
          return Math.sqrt(t)
        }
      }), t.mtof = h.extend({
        type: "mtof",
        maxMidiNote: 8.17579891564 * Math.exp(86.585635235),
        compute: function(t) {
          var e = 0;
          return i.isNumber(t) ? e = -1500 >= t ? 0 : t > 1499 ? this.maxMidiNote : 8.17579891564 * Math.exp(.057762265 * t) : console.error("invalid [mtof] value " + t)
        }
      }), t["samplerate~"] = l.extend({
        type: "samplerate~",
        compute: function() {
          return u.audio.sampleRate
        }
      }), t.spigot = r.extend({
        type: "spigot",
        inletDefs: [c.Inlet.extend({
          message: function(t) {
            this.obj.passing && this.obj.o(0).message(t)
          }
        }), c.Inlet.extend({
          message: function(t) {
            var e = t[0];
            this.obj.setPassing(e)
          }
        })],
        outletDefs: [c.Outlet],
        init: function(t) {
          var e = t[0];
          this.setPassing(e || 0)
        },
        setPassing: function(t) {
          return i.isNumber(t) ? void(this.passing = Boolean(t)) : console.error("invalid [spigot] value " + t)
        }
      }), t.trigger = t.t = r.extend({
        type: "trigger",
        inletDefs: [c.Inlet.extend({
          message: function(t) {
            var e, n, s;
            for (e = this.obj.filters.length - 1; e >= 0; e--) if (n = this.obj.filters[e], "bang" === n) this.obj.o(e).message(o.timeTag(["bang"], t));
            else if ("list" === n || "anything" === n) this.obj.o(e).message(t);
            else if ("float" === n || i.isNumber(n)) s = t[0], this.obj.o(e).message(i.isNumber(s) ? o.timeTag([s], t) : o.timeTag([0], t));
            else if ("symbol" === n) if (s = t[0], "bang" === s) this.obj.o(e).message(o.timeTag(["symbol"], t));
            else if (i.isNumber(s)) this.obj.o(e).message(o.timeTag(["float"], t));
            else {
              if (!i.isString(s)) throw new Error("Got unexpected input " + t);
              this.obj.o(e).message(o.timeTag([s], t))
            } else this.obj.o(e).message(o.timeTag(["bang"], t))
          }
        })],
        init: function(t) {
          var e, n;
          for (0 === t.length && (t = ["bang", "bang"]), e = 0, n = t.length; n > e; e++) this.outlets.push(new c.Outlet(this, e));
          this.filters = t
        }
      });
      var f = c.Inlet.extend({
        message: function(t) {
          var e = t[0];
          "bang" !== e && (this.obj.memory[0] = e), this.obj.o(0).message(o.timeTag(this.obj.memory.slice(0), t))
        }
      }),
          d = c.Inlet.extend({
          message: function(t) {
            var e = t[0];
            this.obj.memory[this.id] = e
          }
        });
      t.pack = r.extend({
        type: "pack",
        outletDefs: [c.Outlet],
        init: function(t) {
          var e, n = t.length;
          for (0 === n && (t = ["float", "float"]), n = t.length, this.filters = t, this.memory = new Array(n), e = 0; n > e; e++) this.inlets[e] = 0 === e ? new f(this, e) : new d(this, e), this.memory[e] = "float" === t[e] ? 0 : "symbol" === t[e] ? "symbol" : t[e]
        }
      }), t.select = t.sel = r.extend({
        type: "select",
        inletDefs: [c.Inlet.extend({
          message: function(t) {
            var e, n = t[0]; - 1 !== (e = this.obj.filters.indexOf(n)) ? this.obj.o(e).message(o.timeTag(["bang"], t)) : this.obj.outlets.slice(-1)[0].message(o.timeTag([n], t))
          }
        }), c.Inlet.extend({
          message: function(t) {
            this.obj.filters.length <= 1 && (this.obj.filters = t)
          }
        })],
        init: function(t) {
          var e, n;
          for (0 === t.length && (t = [0]), t.length > 1 && this.inlets.pop(), e = 0, n = t.length; n > e; e++) this.outlets[e] = new c.Outlet(this, e);
          this.outlets[e] = new c.Outlet(this, e), this.filters = t
        }
      }), t.moses = r.extend({
        type: "moses",
        inletDefs: [c.Inlet.extend({
          message: function(t) {
            var e = t[0];
            return i.isNumber(e) ? void(e < this.obj.val ? this.obj.o(0).message(o.timeTag([e], t)) : this.obj.o(1).message(o.timeTag([e], t))) : console.error("invalid [moses] value " + e)
          }
        }), c.Inlet.extend({
          message: function(t) {
            var e = t[0];
            this.obj.setVal(e)
          }
        })],
        outletDefs: [c.Outlet, c.Outlet],
        init: function(t) {
          var e = t[0];
          this.setVal(e || 0)
        },
        setVal: function(t) {
          return i.isNumber(t) ? void(this.val = t) : console.error("invalid [moses] value " + t)
        }
      }), t.until = r.extend({
        type: "until",
        inletDefs: [c.Inlet.extend({
          message: function(t) {
            var e = t[0];
            if ("bang" === e) this.obj._startLoop(t.timeTag);
            else {
              if (!i.isNumber(e)) return console.error("invalid [until] value " + e);
              this.obj._startLoop(t.timeTag, e)
            }
          }
        }), c.Inlet.extend({
          message: function(t) {
            var e = t[0];
            return "bang" !== e ? console.error("invalid command for [until] " + e) : void this.obj._stopLoop()
          }
        })],
        outletDefs: [c.Outlet],
        init: function() {
          this._looping = !1
        },
        _startLoop: function(t, e) {
          this._looping = !0;
          var n = this,
              s = 0,
              r = function() {
              n.o(0).message(o.timeTag(["bang"], t))
              };
          if (i.isNumber(e)) for (; this._looping && e > s;) r(), s++;
          else
          for (; this._looping;) r();
          this._looping = !1
        },
        _stopLoop: function() {
          this._looping = !1
        }
      }), t.random = r.extend({
        type: "random",
        inletDefs: [c.Inlet.extend({
          message: function(t) {
            var e = t[0];
            "bang" === e && this.obj.o(0).message(o.timeTag([Math.floor(Math.random() * this.obj.max)], t))
          }
        }), c.Inlet.extend({
          message: function(t) {
            var e = t[0];
            this.obj.setMax(e)
          }
        })],
        outletDefs: [c.Outlet],
        init: function(t) {
          var e = t[0];
          this.setMax(e || 1)
        },
        setMax: function(t) {
          return i.isNumber(t) ? void(this.max = t) : console.error("invalid [random] value " + t)
        }
      }), t.metro = r.extend({
        type: "metro",
        inletDefs: [c.Inlet.extend({
          message: function(t) {
            var e = t[0];
            if ("bang" === e) this.obj._restartMetroTick(o.getTimeTag(t));
            else if ("stop" === e) this.obj._stopMetroTick();
            else {
              if (!i.isNumber(e)) return console.error("invalid [metro] value " + e);
              0 === e ? this.obj._stopMetroTick() : this.obj._restartMetroTick(o.getTimeTag(t))
            }
          }
        }), c.Inlet.extend({
          message: function(t) {
            var e = t[0];
            this.obj.setRate(e), this.obj._metroTick = this.obj._metroTickRateChange
          }
        })],
        outletDefs: [c.Outlet],
        init: function(t) {
          var e = t[0];
          this.setRate(e || 0), this._metroHandle = null, this._metroTick = this._metroTickNormal
        },
        setRate: function(t) {
          return i.isNumber(t) ? void(this.rate = Math.max(t, 1)) : console.error("invalid [metro] rate " + t)
        },
        destroy: function() {
          this._stopMetroTick()
        },
        _startMetroTick: function(t) {
          var e = this;
          null === this._metroHandle && (this._metroHandle = u.clock.schedule(function(t) {
            e._metroTick(t.timeTag)
          }, t, this.rate))
        },
        _stopMetroTick: function() {
          null !== this._metroHandle && (u.clock.unschedule(this._metroHandle), this._metroHandle = null)
        },
        _restartMetroTick: function(t) {
          this._metroTick === this._metroTickRateChange && (this._metroTick = this._metroTickNormal), this._stopMetroTick(), this._startMetroTick(t)
        },
        _metroTickNormal: function(t) {
          this.outlets[0].message(o.timeTag(["bang"], t))
        },
        _metroTickRateChange: function(t) {
          this._metroTick = this._metroTickNormal, this._restartMetroTick(t)
        }
      }), t.delay = t.del = r.extend({
        type: "delay",
        inletDefs: [c.Inlet.extend({
          message: function(t) {
            var e = t[0];
            "bang" === e ? (this.obj._stopDelay(), this.obj._startDelay(o.getTimeTag(t))) : "stop" === e ? this.obj._stopDelay() : (this.obj.setDelay(e), this.obj._stopDelay(), this.obj._startDelay(o.getTimeTag(t)))
          }
        }), c.Inlet.extend({
          message: function(t) {
            var e = t[0];
            this.obj.setDelay(e)
          }
        })],
        outletDefs: [c.Outlet],
        init: function(t) {
          var e = t[0];
          this.setDelay(e || 0), this._delayHandle = null
        },
        setDelay: function(t) {
          return i.isNumber(t) ? void(this.delay = t) : console.error("invalid [delay] length " + t)
        },
        destroy: function() {
          this._stopDelay()
        },
        _startDelay: function(t) {
          var e = this;
          null === this._delayHandle && (this._delayHandle = u.clock.schedule(function() {
            e.outlets[0].message(["bang"])
          }, t + this.delay))
        },
        _stopDelay: function() {
          null !== this._delayHandle && (u.clock.unschedule(this._delayHandle), this._delayHandle = null)
        }
      }), t.timer = r.extend({
        type: "timer",
        inletDefs: [c.Inlet.extend({
          message: function(t) {
            var e = t[0];
            return "bang" !== e ? console.error("invalid command for [timer] " + e) : void(this.obj.refTime = o.getTimeTag(t))
          }
        }), c.Inlet.extend({
          message: function(t) {
            var e = t[0];
            return "bang" !== e ? console.error("invalid command for [timer] " + e) : void this.obj.outlets[0].message(o.timeTag([o.getTimeTag(t) - this.obj.refTime], t))
          }
        })],
        outletDefs: [c.Outlet],
        init: function() {
          this.refTime = 0
        }
      }), t.change = r.extend({
        type: "change",
        inletDefs: [c.Inlet.extend({
          message: function(t) {
            var e = t[0];
            e !== this.obj.last && (this.obj.last = e, this.obj.o(0).message(o.timeTag([e], t)))
          }
        })],
        outletDefs: [c.Outlet],
        init: function() {
          this.last = null
        }
      }), t.array = t.table = r.extend(s.NamedMixin, s.EventEmitterMixin, {
        type: "array",
        nameIsUnique: !0,
        init: function(t) {
          var e = t[0],
              n = t[1] || 100;
          e && this.setName(e), this.size = n, this.data = new Float32Array(n)
        },
        destroy: function() {
          s.NamedMixin.destroy.apply(this, arguments), s.EventEmitterMixin.destroy.apply(this, arguments)
        },
        setData: function(t, e) {
          e && (this.data = new Float32Array(t.length)), this.data.set(t.subarray(0, Math.min(this.data.length, t.length))), this.size = this.data.length, this.emit("changed:data")
        }
      }), t.soundfiler = r.extend({
        type: "soundfiler",
        inletDefs: [c.Inlet.extend({
          message: function(t) {
            var e, n, o, s = this,
                r = t[0],
                a = !1;
            if (t = t.slice(1), "read" === r) {
              for (; t.length && "-" === t[0][0];) {
                if (e = t.shift(), "-resize" !== e) return console.error("-wave" === e && "-aiff" === e && "-nextstep" === e && "-raw" === e && "-bytes" === e && "-nframes" === e ? e + " not supported" : e + " not understood");
                a = !0
              }
              n = t.shift(), o = t, u.storage.get(n, function(t, e) {
                return t ? console.error("could not load file : " + t) : void u.audio.decode(e, function(t, e) {
                  if (t) return console.error("Could not decode file : " + t);
                  var n, r, c;
                  r = o.map(function(t) {
                    return n = u.namedObjects.get("array", t)[0], n ? n : (console.error('array "' + t + '" not found'), null)
                  }), i.contains(r, null) || (1 !== i.uniq(i.pluck(r, "size")).length && (a = !0), r.forEach(function(t, n) {
                    c = e[n], c && t.setData(c, a)
                  }), s.obj.o(0).message([Math.min(r[0].size, e[0].length)]))
                })
              })
            } else console.error('command "' + r + '" is not supported')
          }
        })],
        outletDefs: [c.Outlet]
      }), t.pd = a
    }
  }, {
    "./core/Patch": 4,
    "./core/PdObject": 5,
    "./core/mixins": 7,
    "./core/utils": 9,
    "./global": 10,
    "./waa/portlets": 15,
    underscore: 22
  }],
  12: [function(t, e, n) {
    t("underscore");
    n.declareObjects = function(e) {
      t("./glue").declareObjects(e), t("./controls").declareObjects(e), t("./waa/dsp").declareObjects(e), t("./waa/portlets").declareObjects(e)
    }
  }, {
    "./controls": 2,
    "./glue": 11,
    "./waa/dsp": 13,
    "./waa/portlets": 15,
    underscore: 22
  }],
  13: [function(t, e, n) {
    var i = t("underscore"),
        o = t("waaoffsetnode"),
        s = t("waawhitenoisenode"),
        r = t("waatablenode"),
        a = t("../core/utils"),
        u = t("../core/mixins"),
        c = t("../core/PdObject"),
        l = t("./portlets"),
        h = t("../global");

    n.declareObjects = function(t) {
      var e = c.extend({
        inletDefs: [l.DspInlet.extend({
          message: function(t) {
            var e = t[0];
            if (!this.hasDspSource()) {
              if (!i.isNumber(e)) return console.error("invalid [" + this.obj.type + "] frequency " + e);
              e === 1 / 0 && (e = 0), this.obj.frequency = e, this.obj._updateFrequency(a.getTimeTag(t))
            }
          }
        }), l.Inlet.extend({
          message: function(t) {
            var e = t[0];
            return i.isNumber(e) ? void this.obj._updatePhase(e, a.getTimeTag(t)) : console.error("invalid [" + this.obj.type + "] phase " + e)
          }
        })],
        outletDefs: [l.DspOutlet],
        init: function(t) {
          this.frequency = t[0] || 0
        },
        start: function() {
          this._createOscillator(0, 0)
        },
        stop: function() {
          this._destroyOscillator()
        },
        _updateFrequency: function(t) {
          this._oscNode && this._oscNode.frequency.setValueAtTime(this.frequency, t / 1e3)
        },
        _updatePhase: function(t, e) {
          h.isStarted && this._createOscillator(t, e)
        }
      });
      t["osc~"] = e.extend({
        type: "osc~",
        _createOscillator: function(t, e) {
          t = 2 * t * Math.PI, this._oscNode = h.audio.context.createOscillator(), this._oscNode.setPeriodicWave(h.audio.context.createPeriodicWave(new Float32Array([0, Math.cos(t)]), new Float32Array([0, Math.sin(-t)]))), this._oscNode.start(e / 1e3), this.o(0).setWaa(this._oscNode, 0), this.i(0).setWaa(this._oscNode.frequency, 0), this.i(0).message([this.frequency])
        },
        _destroyOscillator: function() {
          this._oscNode.stop(0), this._oscNode = null
        }
      }), t["phasor~"] = e.extend({
        type: "phasor~",
        _createOscillator: function(t, e) {
          this._gainNode = h.audio.context.createGain(), this._gainNode.gain.value = .5, this._oscNode = h.audio.context.createOscillator(), this._oscNode.type = "sawtooth", this._oscNode.start(e / 1e3), this._oscNode.connect(this._gainNode), this._offsetNode = new o(h.audio.context), this._offsetNode.offset.value = 1, this._offsetNode.connect(this._gainNode), this.o(0).setWaa(this._gainNode, 0), this.i(0).setWaa(this._oscNode.frequency, 0), this.i(0).message([this.frequency])
        },
        _destroyOscillator: function() {
          this._oscNode.stop(0), this._oscNode = null, this._gainNode = null, this._offsetNode = null
        }
      }), t["triangle~"] = e.extend({
        type: "triangle~",
        _createOscillator: function(t, e) {
          this._oscNode = h.audio.context.createOscillator(), this._oscNode.type = "triangle", this._oscNode.start(e / 1e3), this.o(0).setWaa(this._oscNode, 0), this.i(0).setWaa(this._oscNode.frequency, 0), this.i(0).message([this.frequency])
        },
        _destroyOscillator: function() {
          this._oscNode.stop(0), this._oscNode = null
        }
      }), t["square~"] = e.extend({
        type: "square~",
        _createOscillator: function(t, e) {
          this._oscNode = h.audio.context.createOscillator(), this._oscNode.type = "square", this._oscNode.start(e / 1e3), this.o(0).setWaa(this._oscNode, 0), this.i(0).setWaa(this._oscNode.frequency, 0), this.i(0).message([this.frequency])
        },
        _destroyOscillator: function() {
          this._oscNode.stop(0), this._oscNode = null
        }
      }), t["noise~"] = c.extend({
        type: "noise~",
        outletDefs: [l.DspOutlet],
        start: function() {
          this._noiseNode = new s(h.audio.context), this._noiseNode.start(0), this.o(0).setWaa(this._noiseNode, 0)
        },
        stop: function() {
          this._noiseNode.stop(0), this._noiseNode.disconnect(), this._noiseNode = null
        }
      }), t["line~"] = c.extend({
        type: "line~",
        inletDefs: [l.Inlet.extend({
          init: function() {
            this._queue = [], this._lastValue = 0
          },
          message: function(t) {
            var e = this;
            if (this.obj._offsetNode) {
              var n = t[0],
                  o = a.getTimeTag(t),
                  s = t[1] || 0;
              if (!i.isNumber(n)) return console.error("invalid [line~] value " + n);
              if (s && !i.isNumber(s)) return console.error("invalid [line~] duration " + s);
              this._refreshQueue(h.audio.time);
              var r = this._pushToQueue(o, n, s);
              this.obj._offsetNode.offset.cancelScheduledValues(r[0].t1 / 1e3 + 1e-6), r.forEach(function(t) {
                t.t1 !== t.t2 ? e.obj._offsetNode.offset.linearRampToValueAtTime(t.v2, t.t2 / 1e3) : e.obj._offsetNode.offset.setValueAtTime(t.v2, t.t2 / 1e3)
              })
            }
          },
          _interpolate: function(t, e) {
            return (e - t.t1) * (t.v2 - t.v1) / (t.t2 - t.t1) + t.v1
          },
          _refreshQueue: function(t) {
            if (0 !== this._queue.length) {
              for (var e, n, i = 0;
              (e = this._queue[i++]) && t >= e.t2;);
              n = this._queue.slice(0, i - 1), this._queue = this._queue.slice(i - 1), 0 === this._queue.length && (this._lastValue = n[n.length - 1].v2)
            }
          },
          _pushToQueue: function(t, e, n) {
            for (var i, o = 0, s = [];
            (i = this._queue[o++]) && t >= i.t2;);
            if (this._queue = this._queue.slice(0), this._queue.length) {
              var r = this._queue[this._queue.length - 1];
              t < r.t2 ? (this._queue = this._queue.slice(0, -1), i = {
                t1: r.t1,
                v1: r.v1,
                t2: t,
                v2: this._interpolate(r, t)
              }, s.push(i), this._queue.push(i)) : t > r.t2 && (i = {
                t1: r.t2,
                v1: r.v2,
                t2: t,
                v2: r.v2
              }, s.push(i), this._queue.push(i))
            } else i = {
              t1: 0,
              v1: this._lastValue,
              t2: t,
              v2: this._lastValue
            }, s.push(i), this._queue.push(i);
            return i = {
              t1: t,
              v1: this._queue[this._queue.length - 1].v2,
              t2: t + n,
              v2: e
            }, s.push(i), this._queue.push(i), s
          }
        })],
        outletDefs: [l.DspOutlet],
        start: function() {
          this._offsetNode = new o(h.audio.context), this._offsetNode.offset.setValueAtTime(0, 0), this.o(0).setWaa(this._offsetNode, 0)
        },
        stop: function() {
          this._offsetNode = null
        }
      }), t["sig~"] = c.extend({
        type: "sig~",
        inletDefs: [l.Inlet.extend({
          message: function(t) {
            var e = t[0];
            return i.isNumber(e) ? (this.obj.value = e, void(this.obj._offsetNode && this.obj._offsetNode.offset.setValueAtTime(e, a.getTimeTag(t) / 1e3))) : console.error("invalid [sig~] value " + e)
          }
        })],
        outletDefs: [l.DspOutlet],
        init: function(t) {
          this.value = t[0] || 0
        },
        start: function() {
          this._offsetNode = new o(h.audio.context), this._offsetNode.offset.setValueAtTime(0, 0), this.o(0).setWaa(this._offsetNode, 0), this.i(0).message([this.value])
        },
        stop: function() {
          this._offsetNode = null
        }
      });
      var n = {
        message: function(t) {
          var e = t[0];
          return i.isNumber(e) ? (this.obj.frequency = e, void(this.obj._filterNode && this.obj._filterNode.frequency.setValueAtTime(e, a.getTimeTag(t) / 1e3))) : console.error("invalid [" + this.obj.type + "] frequency " + e)
        }
      },
          f = {
          message: function(t) {
            var e = t[0];
            return i.isNumber(e) ? (this.obj.Q = e, void(this.obj._filterNode && this.obj._filterNode.Q.setValueAtTime(e, a.getTimeTag(t) / 1e3))) : console.error("invalid [" + this.obj.type + "] Q " + e)
          }
          },
          d = c.extend({
          inletDefs: [l.DspInlet, l.Inlet.extend(n)],
          outletDefs: [l.DspOutlet],
          init: function(t) {
            this.frequency = t[0] || 0
          },
          start: function() {
            this._filterNode = h.audio.context.createBiquadFilter(), this._filterNode.frequency.setValueAtTime(this.frequency, 0), this._filterNode.type = this.waaFilterType, this.i(0).setWaa(this._filterNode, 0), this.o(0).setWaa(this._filterNode, 0), this.i(1).message([this.frequency])
          },
          stop: function() {
            this._filterNode = null
          }
        }),
          p = d.extend({
          waaFilterType: "bandpass",
          init: function(t) {
            d.prototype.init.call(this, t), this.Q = t[1] || 1
          },
          start: function(t) {
            d.prototype.start.call(this, t), this._filterNode.Q.setValueAtTime(this.Q, 0), this.i(2).message([this.Q])
          }
        });
      t["lop~"] = d.extend({
        type: "lop~",
        waaFilterType: "lowpass"
      }), t["hip~"] = d.extend({
        type: "hip~",
        waaFilterType: "highpass"
      }), t["bp~"] = p.extend({
        type: "bp~",
        inletDefs: [l.DspInlet, l.Inlet.extend(n), l.Inlet.extend(f)]
      }), t["vcf~"] = p.extend({
        type: "vcf~",
        inletDefs: [l.DspInlet, l.DspInlet.extend(n), l.Inlet.extend(f)],
        start: function(t) {
          p.prototype.start.call(this, t), this.i(1).setWaa(this._filterNode.frequency, 0)
        }
      });
      var v = c.extend({
        outletDefs: [l.DspOutlet],
        init: function(t) {
          var e = t[0];
          this.setVal(e || 0)
        },
        setVal: function(t) {
          return i.isNumber(t) ? void(this.val = t) : console.error("invalid [" + this.obj.type + "] value " + t)
        }
      }),
          g = {
          message: function(t) {
            var e = t[0];
            this.obj.setVal(e), this.hasDspSource() || this._setValNoDsp(e, a.getTimeTag(t))
          },
          disconnection: function(t) {
            l.DspInlet.prototype.disconnection.apply(this, arguments), t instanceof l.DspOutlet && !this.hasDspSource() && this._setValNoDsp(this.obj.val, 0)
          }
          };
      t["*~"] = v.extend({
        type: "*~",
        inletDefs: [l.DspInlet, l.DspInlet.extend(g, {
          _setValNoDsp: function(t, e) {
            this.obj._gainNode && this.obj._gainNode.gain.setValueAtTime(t, e / 1e3)
          }
        })],
        start: function() {
          this._gainNode = h.audio.context.createGain(), this.i(0).setWaa(this._gainNode, 0), this.i(1).setWaa(this._gainNode.gain, 0), this.o(0).setWaa(this._gainNode, 0), this.i(1).hasDspSource() || this.i(1)._setValNoDsp(this.val, 0)
        },
        stop: function() {
          this._gainNode = null
        }
      }), t["+~"] = v.extend({
        type: "+~",
        inletDefs: [l.DspInlet, l.DspInlet.extend(g, {
          _setValNoDsp: function(t, e) {
            this.obj._offsetNode && this.obj._offsetNode.offset.setValueAtTime(t, e / 1e3)
          }
        })],
        start: function() {
          this._offsetNode = new o(h.audio.context), this._gainNode = h.audio.context.createGain(), this._gainNode.gain.value = 1, this._offsetNode.offset.value = 0, this._offsetNode.connect(this._gainNode, 0, 0), this.i(0).setWaa(this._gainNode, 0), this.i(1).setWaa(this._offsetNode.offset, 0), this.o(0).setWaa(this._gainNode, 0), this.i(1).hasDspSource() || this.i(1)._setValNoDsp(this.val, 0)
        },
        stop: function() {
          this._offsetNode.disconnect(), this._gainNode = null, this._offsetNode = null
        }
      }), t["-~"] = v.extend({
        type: "-~",
        inletDefs: [l.DspInlet, l.DspInlet.extend(g, {
          _setValNoDsp: function(t, e) {
            this.obj._offsetNode && this.obj._offsetNode.offset.setValueAtTime(t, e / 1e3)
          }
        })],
        start: function() {
          this._offsetNode = new o(h.audio.context), this._gainNode = h.audio.context.createGain(), this._negateGainNode = h.audio.context.createGain(), this._gainNode.gain.value = 1, this._negateGainNode.gain.value = -1, this._offsetNode.offset.value = 0, this._offsetNode.connect(this._negateGainNode, 0, 0), this._negateGainNode.connect(this._gainNode, 0, 0), this.i(0).setWaa(this._gainNode, 0), this.i(1).setWaa(this._offsetNode.offset, 0), this.o(0).setWaa(this._gainNode, 0), this.i(1).hasDspSource() || this.i(1)._setValNoDsp(this.val, 0)
        },
        stop: function() {
          this._negateGainNode.disconnect(), this._offsetNode.disconnect(), this._gainNode = null, this._negateGainNode = null, this._offsetNode = null
        }
      });
      var m = c.extend({
        init: function(t) {
          var e = this;
          this.array = new u.Reference("array"), this._onDataChangedHandler = null, this._eventReceiver = new u.EventReceiver, this._eventReceiver.on(this.array, "changed", function(t, n) {
            n && n.removeListener("changed:data", e._onDataChangedHandler), t && (e._onDataChangedHandler = function() {
              e.dataChanged()
            }, e._eventReceiver.on(t, "changed:data", e._onDataChangedHandler))
          })
        },
        dataChanged: function() {},
        destroy: function() {
          this._eventReceiver.destroy(), this.array.destroy()
        }
      });
      t["tabread~"] = t["tabread4~"] = m.extend({
        type: "tabread~",
        inletDefs: [l.DspInlet.extend({
          message: function(t) {
            var e = t[0];
            "set" === e ? this.obj.array.set(t[1]) : console.error("unknown method " + e)
          },
          connection: function() {
            l.DspInlet.prototype.connection.apply(this, arguments), this.obj._updateDsp()
          },
          disconnection: function() {
            l.DspInlet.prototype.disconnection.apply(this, arguments), this.obj._updateDsp()
          }
        })],
        outletDefs: [l.DspOutlet],
        init: function(t) {
          var e = this,
              n = t[0];
          m.prototype.init.apply(this, arguments), this._eventReceiver.on(this.array, "changed", function() {
            e._updateDsp()
          }), n && this.array.set(n)
        },
        start: function() {
          this._tableNode = new r(h.audio.context), this._gainNode = h.audio.context.createGain(), this.i(0).setWaa(this._tableNode.position, 0), this.o(0).setWaa(this._gainNode, 0), this._updateDsp()
        },
        stop: function() {
          this._tableNode = null, this._gainNode = null
        },
        dataChanged: function() {
          this._tableNode && (this._tableNode.table = this.array.resolved.data)
        },
        _updateDsp: function() {
          this._tableNode && this.array.resolved && this.i(0).hasDspSource() ? (this._tableNode.table = this.array.resolved.data, this._tableNode.connect(this._gainNode)) : this._tableNode && this._tableNode.disconnect()
        }
      }), t["delwrite~"] = c.extend(u.NamedMixin, u.EventEmitterMixin, {
        type: "delwrite~",
        inletDefs: [l.DspInlet],
        init: function(t) {
          var e = t[0],
              n = t[1];
          this.maxDelayTime = n || 1e3, e && this.setName(e)
        },
        start: function() {
          this._pipeNode = h.audio.context.createGain(), this.i(0).setWaa(this._pipeNode, 0), this.emit("started")
        },
        stop: function() {
          this._pipeNode.disconnect(), this._pipeNode = null
        },
        destroy: function() {
          u.NamedMixin.destroy.apply(this, arguments), u.EventEmitterMixin.destroy.apply(this, arguments)
        }
      }), t["delread~"] = t["vd~"] = c.extend({
        type: "delread~",
        inletDefs: [l.DspInlet.extend({
          message: function(t) {
            var e = t[0];
            this.obj.setDelayTime(e, a.getTimeTag(t))
          }
        })],
        outletDefs: [l.DspOutlet],
        init: function(t) {
          var e = t[0],
              n = t[1];
          this._eventReceiver = new u.EventReceiver, this._delayTime = n || 0, this._delWrite = new u.Reference("delwrite~"), this._onDelWriteStarted = null, e && this._delWrite.set(e)
        },
        start: function() {
          this._createDelay(), this._onDelWriteChanged = function(t, e) {
            h.isStarted && t && self._createDelay()
          }, this._eventReceiver.on(this._delWrite, "changed", this._onDelWriteChanged)
        },
        stop: function() {
          this._toSecondsGain = null, this._delayNode.disconnect(), this._delayNode = null, this._delWrite.removeListener("changed", this._onDelWriteChanged), this._onDelWriteChanged = null
        },
        destroy: function() {
          this._delWrite.destroy(), this._eventReceiver.destroy()
        },
        setDelayTime: function(t, e) {
          return i.isNumber(t) ? (this._delayTime = t, void(this._delayNode && !this.i(0).hasDspSource() && this._delayNode.delayTime.setValueAtTime(this._delayTime / 1e3, e / 1e3 || 0))) : console.error("invalid [delread~] length " + t)
        },
        _createDelay: function() {
          this._delayNode && this._delayNode.disconnect();
          var t = this._delWrite.resolved ? this._delWrite.resolved.maxDelayTime / 1e3 : 1,
              e = this;
          if (this._delayNode = h.audio.context.createDelay(t), this._toSecondsGain || (this._toSecondsGain = h.audio.context.createGain(), this._toSecondsGain.gain.value = .001, this.i(0).setWaa(this._toSecondsGain, 0)), this._toSecondsGain.connect(this._delayNode.delayTime), this.o(0).setWaa(this._delayNode, 0), this.setDelayTime(this._delayTime), this._delWrite.resolved) {
            var n = function() {
              e._delWrite.resolved._pipeNode.connect(e._delayNode)
            };
            this._delWrite.resolved._pipeNode ? n() : (this._onDelWriteStarted = n, this._eventReceiver.once(this._delWrite.resolved, "started", this._onDelWriteStarted))
          }
        }
      }), t["clip~"] = c.extend({
        type: "clip~",
        inletDefs: [l.DspInlet, l.Inlet.extend({
          message: function(t) {
            var e = t[0];
            return i.isNumber(e) ? (this.obj.minValue = e, void this.obj._updateGains()) : console.error("invalid [clip~] min " + e)
          }
        }), l.Inlet.extend({
          message: function(t) {
            var e = t[0];
            return i.isNumber(e) ? (this.obj.maxValue = e, void this.obj._updateGains()) : console.error("invalid [clip~] max " + e)
          }
        })],
        outletDefs: [l.DspOutlet],
        init: function(t) {
          this.minValue = t[0] || 0, this.maxValue = t[1] || 0
        },
        start: function() {
          this._gainInNode = h.audio.context.createGain(), this._gainOutNode = h.audio.context.createGain(), this._waveShaperNode = h.audio.context.createWaveShaper(), this._gainInNode.connect(this._waveShaperNode), this.i(0).setWaa(this._gainInNode, 0), this.o(0).setWaa(this._waveShaperNode, 0), this._updateGains()
        },
        stop: function() {
          this._gainInNode = null, this._waveShaperNode = null, this._gainOutNode.disconnect(), this._gainOutNode = null
        },
        _updateGains: function() {
          if (this._waveShaperNode) {
            var t, e = Math.max(Math.abs(this.minValue), Math.abs(this.maxValue)),
                n = h.audio.sampleRate,
                i = new Float32Array(n),
                o = -e,
                s = 2 * e / n;
            for (t = 0; n > t; t++) i[t] = o >= this.minValue && o <= this.maxValue ? o : o > this.maxValue ? this.maxValue : this.minValue, o += s;
            this._waveShaperNode.curve = i, this._gainInNode.gain.setValueAtTime(0 !== e ? 1 / e : 0, 0)
          }
        }
      }), t["dac~"] = c.extend({
        type: "dac~",
        endPoint: !0,
        inletDefs: [l.DspInlet, l.DspInlet],
        start: function() {
          this.i(0).setWaa(h.audio.channels[0], 0), this.i(1).setWaa(h.audio.channels[1], 0)
        }
      })
    }
  }, {
    "../core/PdObject": 5,
    "../core/mixins": 7,
    "../core/utils": 9,
    "../global": 10,
    "./portlets": 15,
    underscore: 22,
    waaoffsetnode: 25,
    waatablenode: 27,
    waawhitenoisenode: 31
  }],
  14: [function(t, e, n) {
    var i = t("underscore"),
        o = t("waaclock"),
        s = (t("../global"), n.Audio = function(t) {
        return "undefined" == typeof AudioContext ? console.error("this environment doesn't support Web Audio API") : (this.channelCount = t.channelCount, this.setContext(t.audioContext || new AudioContext), this.sampleRate = this.context.sampleRate, void Object.defineProperty(this, "time", {
          get: function() {
            return 1e3 * this.context.currentTime
          }
        }))
      });
    s.prototype.start = function() {}, s.prototype.stop = function() {}, s.prototype.decode = function(t, e) {
      this.context.decodeAudioData(t, function(t) {
        var n, i = [];
        for (n = 0; n < t.numberOfChannels; n++) i.push(t.getChannelData(n));
        e(null, i)
      }, function(t) {
        e(new Error("error decoding " + t))
      })
    }, s.prototype.setContext = function(t) {
      var e;
      for (this.context = t, this._channelMerger = this.context.createChannelMerger(this.channelCount), this._channelMerger.connect(this.context.destination), this.channels = [], e = 0; e < this.channelCount; e++) this.channels.push(this.context.createGain()), this.channels[e].connect(this._channelMerger, 0, e)
    };
    var r = n.Clock = function(t) {
      var e = this;
      this._audioContext = t.audioContext, this._waaClock = t.waaClock || new o(t.audioContext), this._waaClock.start(), Object.defineProperty(this, "time", {
        get: function() {
          return 1e3 * e._audioContext.currentTime
        }
      })
    };
    r.prototype.schedule = function(t, e, n) {
      var o = function(e) {
        void 0 == e.timeTag && (e.timeTag = 1e3 * e.deadline), t(e)
      },
          s = this._waaClock.callbackAtTime(o, e / 1e3);
      return Object.defineProperty(s, "timeTag", {
        get: function() {
          return 1e3 * this.deadline
        }
      }), i.isNumber(n) && s.repeat(n / 1e3), s
    }, r.prototype.unschedule = function(t) {
      t.clear()
    };
    var a = n.Storage = function() {};
    a.prototype.get = function(t, e) {
      var n = new XMLHttpRequest;
      n.onload = function(t) {
        200 === this.status ? e(null, this.response) : e(new Error("HTTP " + this.status + ": " + this.statusText))
      }, n.onerror = function(t) {
        e(t)
      }, n.open("GET", t, !0), n.responseType = "arraybuffer", n.send()
    }
  }, {
    "../global": 10,
    underscore: 22,
    waaclock: 23
  }],
  15: [function(t, e, n) {
    var i = t("underscore"),
        o = t("waawire"),
        s = t("../core/utils"),
        r = t("../core/PdObject"),
        a = t("../core/portlets").Inlet,
        u = t("../core/portlets").Outlet,
        c = t("../global"),
        l = "undefined" != typeof window ? window.AudioParam : function() {},
        h = {
        future: function(t, e) {
          this.message(s.timeTag(e, t))
        }
        },
        f = n.Inlet = a.extend(h),
        d = n.Outlet = u.extend({
        message: function(t) {
          this.connections.forEach(function(e) {
            e.message(t)
          })
        }
      }),
        p = n.DspInlet = a.extend(h, {
        hasDspSource: function() {
          return i.filter(this.connections, function(t) {
            return t instanceof v
          }).length > 0
        },
        init: function() {
          this._started = !1
        },
        start: function() {
          this._started = !0
        },
        stop: function() {
          this._waa = null, this._started = !1
        },
        setWaa: function(t, e) {
          var n = this;
          this._waa = {
            node: t,
            input: e
          }, t instanceof l && t.setValueAtTime(0, 0), this._started && i.chain(this.connections).filter(function(t) {
            return t instanceof v
          }).forEach(function(t) {
            t._waaUpdate(n)
          }).value()
        }
      }),
        v = n.DspOutlet = u.extend({
        init: function() {
          this._waaConnections = {}, this._started = !1
        },
        start: function() {
          this._started = !0, this.connections.forEach(this._waaConnect.bind(this))
        },
        stop: function() {
          this._started = !1, this.connections.forEach(this._waaDisconnect.bind(this)), this._waaConnections = {}
        },
        connection: function(t) {
          if (!(t instanceof p)) throw new Error("can only connect to DSP inlet");
          this._started && this._waaConnect(t)
        },
        disconnection: function(t) {
          this._started && this._waaDisconnect(t)
        },
        message: function() {
          throw new Error("dsp outlet received a message")
        },
        setWaa: function(t, e) {
          this._waa = {
            node: t,
            output: e
          }, t instanceof l && t.setValueAtTime(0, 0), this._started && i.values(this._waaConnections).forEach(function(n) {
            n.swapSource(t, e)
          })
        },
        _waaConnect: function(t) {
          var e = new o(c.audio.context);
          this._waaConnections[this._getConnectionId(t)] = e, e.connect(this._waa.node, t._waa.node, this._waa.output, t._waa.input)
        },
        _waaDisconnect: function(t) {
          var e = this._waaConnections[this._getConnectionId(t)];
          delete this._waaConnections[this._getConnectionId(t)], e.close()
        },
        _waaUpdate: function(t) {
          this._waaConnections[this._getConnectionId(t)].swapDestination(t._waa.node, t._waa.input)
        },
        _getConnectionId: function(t) {
          return t.obj.id + ":" + t.id
        }
      });
    n.declareObjects = function(t) {
      var e = f.extend({
        message: function(t) {
          this.obj.outlets[0].message(t)
        }
      }),
          n = p.extend({
          message: function(t) {
            this.obj.outlets[0].message(t)
          }
        }),
          i = v.extend({
          message: function(t) {
            this.sinks.forEach(function(e) {
              e.message(t)
            })
          }
        }),
          o = {
          start: function() {
            this._gainNode = c.audio.context.createGain(), this._gainNode.gain.value = 1, this.i(0).setWaa(this._gainNode, 0), this.o(0).setWaa(this._gainNode, 0)
          },
          stop: function() {
            this._gainNode = null
          }
          };
      t.outlet = r.extend({
        type: "outlet",
        inletDefs: [e],
        outletDefs: [d.extend({
          crossPatch: !0
        })]
      }), t.inlet = r.extend({
        type: "inlet",
        inletDefs: [e.extend({
          crossPatch: !0
        })],
        outletDefs: [d]
      }), t["outlet~"] = r.extend(o, {
        type: "outlet~",
        inletDefs: [n],
        outletDefs: [i.extend({
          crossPatch: !0
        })]
      }), t["inlet~"] = r.extend(o, {
        type: "inlet~",
        inletDefs: [n.extend({
          crossPatch: !0
        })],
        outletDefs: [i]
      })
    }
  }, {
    "../core/PdObject": 5,
    "../core/portlets": 8,
    "../core/utils": 9,
    "../global": 10,
    underscore: 22,
    waawire: 33
  }],
  16: [function(t, e, n) {
    function i() {
      this._events = this._events || {}, this._maxListeners = this._maxListeners || void 0
    }
    function o(t) {
      return "function" == typeof t
    }
    function s(t) {
      return "number" == typeof t
    }
    function r(t) {
      return "object" == typeof t && null !== t
    }
    function a(t) {
      return void 0 === t
    }
    e.exports = i, i.EventEmitter = i, i.prototype._events = void 0, i.prototype._maxListeners = void 0, i.defaultMaxListeners = 10, i.prototype.setMaxListeners = function(t) {
      if (!s(t) || 0 > t || isNaN(t)) throw TypeError("n must be a positive number");
      return this._maxListeners = t, this
    }, i.prototype.emit = function(t) {
      var e, n, i, s, u, c;
      if (this._events || (this._events = {}), "error" === t && (!this._events.error || r(this._events.error) && !this._events.error.length)) {
        if (e = arguments[1], e instanceof Error) throw e;
        throw TypeError('Uncaught, unspecified "error" event.')
      }
      if (n = this._events[t], a(n)) return !1;
      if (o(n)) switch (arguments.length) {
      case 1:
        n.call(this);
        break;
      case 2:
        n.call(this, arguments[1]);
        break;
      case 3:
        n.call(this, arguments[1], arguments[2]);
        break;
      default:
        for (i = arguments.length, s = new Array(i - 1), u = 1; i > u; u++) s[u - 1] = arguments[u];
        n.apply(this, s)
      } else if (r(n)) {
        for (i = arguments.length, s = new Array(i - 1), u = 1; i > u; u++) s[u - 1] = arguments[u];
        for (c = n.slice(), i = c.length, u = 0; i > u; u++) c[u].apply(this, s)
      }
      return !0
    }, i.prototype.addListener = function(t, e) {
      var n;
      if (!o(e)) throw TypeError("listener must be a function");
      if (this._events || (this._events = {}), this._events.newListener && this.emit("newListener", t, o(e.listener) ? e.listener : e), this._events[t] ? r(this._events[t]) ? this._events[t].push(e) : this._events[t] = [this._events[t], e] : this._events[t] = e, r(this._events[t]) && !this._events[t].warned) {
        var n;
        n = a(this._maxListeners) ? i.defaultMaxListeners : this._maxListeners, n && n > 0 && this._events[t].length > n && (this._events[t].warned = !0, console.error("(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.", this._events[t].length), "function" == typeof console.trace && console.trace())
      }
      return this
    }, i.prototype.on = i.prototype.addListener, i.prototype.once = function(t, e) {
      function n() {
        this.removeListener(t, n), i || (i = !0, e.apply(this, arguments))
      }
      if (!o(e)) throw TypeError("listener must be a function");
      var i = !1;
      return n.listener = e, this.on(t, n), this
    }, i.prototype.removeListener = function(t, e) {
      var n, i, s, a;
      if (!o(e)) throw TypeError("listener must be a function");
      if (!this._events || !this._events[t]) return this;
      if (n = this._events[t], s = n.length, i = -1, n === e || o(n.listener) && n.listener === e) delete this._events[t], this._events.removeListener && this.emit("removeListener", t, e);
      else if (r(n)) {
        for (a = s; a-- > 0;) if (n[a] === e || n[a].listener && n[a].listener === e) {
          i = a;
          break
        }
        if (0 > i) return this;
        1 === n.length ? (n.length = 0, delete this._events[t]) : n.splice(i, 1), this._events.removeListener && this.emit("removeListener", t, e)
      }
      return this
    }, i.prototype.removeAllListeners = function(t) {
      var e, n;
      if (!this._events) return this;
      if (!this._events.removeListener) return 0 === arguments.length ? this._events = {} : this._events[t] && delete this._events[t], this;
      if (0 === arguments.length) {
        for (e in this._events)"removeListener" !== e && this.removeAllListeners(e);
        return this.removeAllListeners("removeListener"), this._events = {}, this
      }
      if (n = this._events[t], o(n)) this.removeListener(t, n);
      else
      for (; n.length;) this.removeListener(t, n[n.length - 1]);
      return delete this._events[t], this
    }, i.prototype.listeners = function(t) {
      var e;
      return e = this._events && this._events[t] ? o(this._events[t]) ? [this._events[t]] : this._events[t].slice() : []
    }, i.listenerCount = function(t, e) {
      var n;
      return n = t._events && t._events[e] ? o(t._events[e]) ? 1 : t._events[e].length : 0
    }
  }, {}],
  17: [function(t, e, n) {
    e.exports = "function" == typeof Object.create ?
    function(t, e) {
      t.super_ = e, t.prototype = Object.create(e.prototype, {
        constructor: {
          value: t,
          enumerable: !1,
          writable: !0,
          configurable: !0
        }
      })
    } : function(t, e) {
      t.super_ = e;
      var n = function() {};
      n.prototype = e.prototype, t.prototype = new n, t.prototype.constructor = t
    }
  }, {}],
  18: [function(t, e, n) {
    function i() {}
    var o = e.exports = {};
    o.nextTick = function() {
      var t = "undefined" != typeof window && window.setImmediate,
          e = "undefined" != typeof window && window.MutationObserver,
          n = "undefined" != typeof window && window.postMessage && window.addEventListener;
      if (t) return function(t) {
        return window.setImmediate(t)
      };
      var i = [];
      if (e) {
        var o = document.createElement("div"),
            s = new MutationObserver(function() {
            var t = i.slice();
            i.length = 0, t.forEach(function(t) {
              t()
            })
          });
        return s.observe(o, {
          attributes: !0
        }), function(t) {
          i.length || o.setAttribute("yes", "no"), i.push(t)
        }
      }
      return n ? (window.addEventListener("message", function(t) {
        var e = t.source;
        if ((e === window || null === e) && "process-tick" === t.data && (t.stopPropagation(), i.length > 0)) {
          var n = i.shift();
          n()
        }
      }, !0), function(t) {
        i.push(t), window.postMessage("process-tick", "*")
      }) : function(t) {
        setTimeout(t, 0)
      }
    }(), o.title = "browser", o.browser = !0, o.env = {}, o.argv = [], o.on = i, o.addListener = i, o.once = i, o.off = i, o.removeListener = i, o.removeAllListeners = i, o.emit = i, o.binding = function(t) {
      throw new Error("process.binding is not supported")
    }, o.cwd = function() {
      return "/"
    }, o.chdir = function(t) {
      throw new Error("process.chdir is not supported")
    }
  }, {}],
  19: [function(t, e, n) {
    e.exports = function(t) {
      return t && "object" == typeof t && "function" == typeof t.copy && "function" == typeof t.fill && "function" == typeof t.readUInt8
    }
  }, {}],
  20: [function(t, e, n) {
    (function(e, i) {
      function o(t, e) {
        var i = {
          seen: [],
          stylize: r
        };
        return arguments.length >= 3 && (i.depth = arguments[2]), arguments.length >= 4 && (i.colors = arguments[3]), v(e) ? i.showHidden = e : e && n._extend(i, e), x(i.showHidden) && (i.showHidden = !1), x(i.depth) && (i.depth = 2), x(i.colors) && (i.colors = !1), x(i.customInspect) && (i.customInspect = !0), i.colors && (i.stylize = s), u(i, t, i.depth)
      }
      function s(t, e) {
        var n = o.styles[e];
        return n ? "[" + o.colors[n][0] + "m" + t + "[" + o.colors[n][1] + "m" : t
      }
      function r(t, e) {
        return t
      }
      function a(t) {
        var e = {};
        return t.forEach(function(t, n) {
          e[t] = !0
        }), e
      }
      function u(t, e, i) {
        if (t.customInspect && e && D(e.inspect) && e.inspect !== n.inspect && (!e.constructor || e.constructor.prototype !== e)) {
          var o = e.inspect(i, t);
          return y(o) || (o = u(t, o, i)), o
        }
        var s = c(t, e);
        if (s) return s;
        var r = Object.keys(e),
            v = a(r);
        if (t.showHidden && (r = Object.getOwnPropertyNames(e)), T(e) && (r.indexOf("message") >= 0 || r.indexOf("description") >= 0)) return l(e);
        if (0 === r.length) {
          if (D(e)) {
            var g = e.name ? ": " + e.name : "";
            return t.stylize("[Function" + g + "]", "special")
          }
          if (w(e)) return t.stylize(RegExp.prototype.toString.call(e), "regexp");
          if (j(e)) return t.stylize(Date.prototype.toString.call(e), "date");
          if (T(e)) return l(e)
        }
        var m = "",
            _ = !1,
            b = ["{", "}"];
        if (p(e) && (_ = !0, b = ["[", "]"]), D(e)) {
          var x = e.name ? ": " + e.name : "";
          m = " [Function" + x + "]"
        }
        if (w(e) && (m = " " + RegExp.prototype.toString.call(e)), j(e) && (m = " " + Date.prototype.toUTCString.call(e)), T(e) && (m = " " + l(e)), 0 === r.length && (!_ || 0 == e.length)) return b[0] + m + b[1];
        if (0 > i) return w(e) ? t.stylize(RegExp.prototype.toString.call(e), "regexp") : t.stylize("[Object]", "special");
        t.seen.push(e);
        var N;
        return N = _ ? h(t, e, i, v, r) : r.map(function(n) {
          return f(t, e, i, v, n, _)
        }), t.seen.pop(), d(N, m, b)
      }
      function c(t, e) {
        if (x(e)) return t.stylize("undefined", "undefined");
        if (y(e)) {
          var n = "'" + JSON.stringify(e).replace(/^"|"$/g, "").replace(/'/g, "\\'").replace(/\\"/g, '"') + "'";
          return t.stylize(n, "string")
        }
        return _(e) ? t.stylize("" + e, "number") : v(e) ? t.stylize("" + e, "boolean") : g(e) ? t.stylize("null", "null") : void 0
      }
      function l(t) {
        return "[" + Error.prototype.toString.call(t) + "]"
      }
      function h(t, e, n, i, o) {
        for (var s = [], r = 0, a = e.length; a > r; ++r) s.push(k(e, String(r)) ? f(t, e, n, i, String(r), !0) : "");
        return o.forEach(function(o) {
          o.match(/^\d+$/) || s.push(f(t, e, n, i, o, !0))
        }), s
      }
      function f(t, e, n, i, o, s) {
        var r, a, c;
        if (c = Object.getOwnPropertyDescriptor(e, o) || {
          value: e[o]
        }, c.get ? a = c.set ? t.stylize("[Getter/Setter]", "special") : t.stylize("[Getter]", "special") : c.set && (a = t.stylize("[Setter]", "special")), k(i, o) || (r = "[" + o + "]"), a || (t.seen.indexOf(c.value) < 0 ? (a = g(n) ? u(t, c.value, null) : u(t, c.value, n - 1), a.indexOf("\n") > -1 && (a = s ? a.split("\n").map(function(t) {
          return "  " + t
        }).join("\n").substr(2) : "\n" + a.split("\n").map(function(t) {
          return "   " + t
        }).join("\n"))) : a = t.stylize("[Circular]", "special")), x(r)) {
          if (s && o.match(/^\d+$/)) return a;
          r = JSON.stringify("" + o), r.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/) ? (r = r.substr(1, r.length - 2), r = t.stylize(r, "name")) : (r = r.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'"), r = t.stylize(r, "string"))
        }
        return r + ": " + a
      }
      function d(t, e, n) {
        var i = 0,
            o = t.reduce(function(t, e) {
            return i++, e.indexOf("\n") >= 0 && i++, t + e.replace(/\u001b\[\d\d?m/g, "").length + 1
          }, 0);
        return o > 60 ? n[0] + ("" === e ? "" : e + "\n ") + " " + t.join(",\n  ") + " " + n[1] : n[0] + e + " " + t.join(", ") + " " + n[1]
      }
      function p(t) {
        return Array.isArray(t)
      }
      function v(t) {
        return "boolean" == typeof t
      }
      function g(t) {
        return null === t
      }
      function m(t) {
        return null == t
      }
      function _(t) {
        return "number" == typeof t
      }
      function y(t) {
        return "string" == typeof t
      }
      function b(t) {
        return "symbol" == typeof t
      }
      function x(t) {
        return void 0 === t
      }
      function w(t) {
        return N(t) && "[object RegExp]" === A(t)
      }
      function N(t) {
        return "object" == typeof t && null !== t
      }
      function j(t) {
        return N(t) && "[object Date]" === A(t)
      }
      function T(t) {
        return N(t) && ("[object Error]" === A(t) || t instanceof Error)
      }
      function D(t) {
        return "function" == typeof t
      }
      function O(t) {
        return null === t || "boolean" == typeof t || "number" == typeof t || "string" == typeof t || "symbol" == typeof t || "undefined" == typeof t
      }
      function A(t) {
        return Object.prototype.toString.call(t)
      }
      function E(t) {
        return 10 > t ? "0" + t.toString(10) : t.toString(10)
      }
      function C() {
        var t = new Date,
            e = [E(t.getHours()), E(t.getMinutes()), E(t.getSeconds())].join(":");
        return [t.getDate(), R[t.getMonth()], e].join(" ")
      }
      function k(t, e) {
        return Object.prototype.hasOwnProperty.call(t, e)
      }
      var I = /%[sdj%]/g;
      n.format = function(t) {
        if (!y(t)) {
          for (var e = [], n = 0; n < arguments.length; n++) e.push(o(arguments[n]));
          return e.join(" ")
        }
        for (var n = 1, i = arguments, s = i.length, r = String(t).replace(I, function(t) {
          if ("%%" === t) return "%";
          if (n >= s) return t;
          switch (t) {
          case "%s":
            return String(i[n++]);
          case "%d":
            return Number(i[n++]);
          case "%j":
            try {
              return JSON.stringify(i[n++])
            } catch (e) {
              return "[Circular]"
            }
          default:
            return t
          }
        }), a = i[n]; s > n; a = i[++n]) r += g(a) || !N(a) ? " " + a : " " + o(a);
        return r
      }, n.deprecate = function(t, o) {
        function s() {
          if (!r) {
            if (e.throwDeprecation) throw new Error(o);
            e.traceDeprecation ? console.trace(o) : console.error(o), r = !0
          }
          return t.apply(this, arguments)
        }
        if (x(i.process)) return function() {
          return n.deprecate(t, o).apply(this, arguments)
        };
        if (e.noDeprecation === !0) return t;
        var r = !1;
        return s
      };
      var M, S = {};
      n.debuglog = function(t) {
        if (x(M) && (M = e.env.NODE_DEBUG || ""), t = t.toUpperCase(), !S[t]) if (new RegExp("\\b" + t + "\\b", "i").test(M)) {
          var i = e.pid;
          S[t] = function() {
            var e = n.format.apply(n, arguments);
            console.error("%s %d: %s", t, i, e)
          }
        } else S[t] = function() {};
        return S[t]
      }, n.inspect = o, o.colors = {
        bold: [1, 22],
        italic: [3, 23],
        underline: [4, 24],
        inverse: [7, 27],
        white: [37, 39],
        grey: [90, 39],
        black: [30, 39],
        blue: [34, 39],
        cyan: [36, 39],
        green: [32, 39],
        magenta: [35, 39],
        red: [31, 39],
        yellow: [33, 39]
      }, o.styles = {
        special: "cyan",
        number: "yellow",
        "boolean": "yellow",
        undefined: "grey",
        "null": "bold",
        string: "green",
        date: "magenta",
        regexp: "red"
      }, n.isArray = p, n.isBoolean = v, n.isNull = g, n.isNullOrUndefined = m, n.isNumber = _, n.isString = y, n.isSymbol = b, n.isUndefined = x, n.isRegExp = w, n.isObject = N, n.isDate = j, n.isError = T, n.isFunction = D, n.isPrimitive = O, n.isBuffer = t("./support/isBuffer");
      var R = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      n.log = function() {
        console.log("%s - %s", C(), n.format.apply(n, arguments))
      }, n.inherits = t("inherits"), n._extend = function(t, e) {
        if (!e || !N(e)) return t;
        for (var n = Object.keys(e), i = n.length; i--;) t[n[i]] = e[n[i]];
        return t
      }
    }).call(this, t("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
  }, {
    "./support/isBuffer": 19,
    _process: 18,
    inherits: 17
  }],
  21: [function(t, e, n) {
    var i = t("underscore"),
        o = ["obj", "floatatom", "symbolatom", "msg", "text"],
        s = / |\r\n?|\n/,
        r = /,(?!\\)/,
        a = /\\(\$\d+)/g,
        u = /\\\,/g,
        c = /\\\;/g,
        l = /(#((.|\r|\n)*?)[^\\\\])\r{0,1}\n{0,1};\r{0,1}(\n|$)/i,
        h = function(t) {
        return t.split("").reverse().join("")
        },
        f = n.parseArg = function(t) {
        var e = d(t);
        if (i.isNumber(e) && !isNaN(e)) return e;
        if (i.isString(t)) {
          var n, t = t.substr(0);
          for (t = t.replace(u, ","), t = t.replace(c, ";"); n = a.exec(t);) t = t.replace(n[0], n[1]);
          return t
        }
        throw new Error("couldn't parse arg " + t)
        },
        d = n.parseFloat = function(t) {
        return i.isNumber(t) && !isNaN(t) ? t : i.isString(t) ? parseFloat(t) : 0 / 0
        },
        p = n.parseArgs = function(t) {
        if (i.isNumber(t) && !isNaN(t)) return [t];
        var e, n, o, r = i.isString(t) ? t.split(s) : t,
            a = [];
        for (n = 0, o = r.length; o > n; n++)"" !== (e = r[n]) && a.push(f(e));
        return a
        };
    n.parse = function(t) {
      return v(t)[0]
    };
    var v = function(t) {
      var e, n = null,
          a = -1,
          u = function() {
          return a++, a
          },
          c = {
          nodes: [],
          connections: [],
          layout: void 0,
          args: []
          },
          f = !0,
          d = function() {
          t = t.slice(e.index + e[0].length)
          };
      for (l.lastIndex = 0; e = t.match(l);) {
        var m = h(e[1]).split(r).reverse().map(h),
            _ = m[1],
            y = m[0].split(s),
            b = y[0];

        if ("#N" === b) {
          var x = y[1];
          if ("canvas" !== x) throw new Error("invalid element type for chunk #N : " + x);
          if (f) c.layout = {
            x: parseInt(y[2], 10),
            y: parseInt(y[3], 10),
            width: parseInt(y[4], 10),
            height: parseInt(y[5], 10),
            openOnLoad: y[7]
          }, c.args = [y[6]], d();
          else {
            var w = v(t),
                N = w[0],
                j = w[2];
            c.nodes.push(i.extend({
              id: u(),
              subpatch: N
            }, j)), t = w[1]
          }
        } else if ("#X" === b) {
          var x = y[1];
          if ("restore" === x) {
            var T = {
              x: parseInt(y[2], 10),
              y: parseInt(y[3], 10)
            },
                D = y[4],
                O = [];
            if ("pd" === D && O.push(y[5]), n) {
              for (var A = n.args[1]; n.data.length < A;) n.data.push(0);
              n = null
            }
            return d(), [c, t,
            {
              proto: D,
              args: O,
              layout: T
            }]
          }
          if (i.contains(o, x)) {
            var E, O, w, T = {
              x: parseInt(y[2], 10),
              y: parseInt(y[3], 10)
            };
            if ("obj" === x ? (E = y[4], O = y.slice(5)) : (E = x, O = y.slice(4)), "text" === x && (O = [y.slice(4).join(" ")]), w = g(E, O, T), O = w[0], T = w[1], _) for (var C = _.split(s); C.length;) {
              var k = C.shift();
              "f" === k && (T.width = C.shift())
            }
            c.nodes.push({
              id: u(),
              proto: E,
              layout: T,
              args: p(O)
            })
          } else if ("array" === x) {
            var I = y[2],
                M = parseFloat(y[3]),
                S = {
                id: u(),
                proto: "table",
                args: [I, M],
                data: []
                };
            c.nodes.push(S), n = S
          } else if ("connect" === x) {
            var R = parseInt(y[2], 10),
                P = parseInt(y[4], 10),
                W = parseInt(y[3], 10),
                q = parseInt(y[5], 10);
            c.connections.push({
              source: {
                id: R,
                port: W
              },
              sink: {
                id: P,
                port: q
              }
            })
          } else if ("coords" !== x) throw new Error("invalid element type for chunk #X : " + x);
          d()
        } else {
          if ("#A" !== b) throw new Error("invalid chunk : " + b);
          var L, F, V, G = parseFloat(y[1]);
          if (n) for (L = 2, F = y.length; F > L; L++, G++) V = parseFloat(y[L]), i.isNumber(V) && !isNaN(V) && (n.data[G] = V);
          else console.error("got table data outside of a table.");
          d()
        }
        f = !1
      }
      return [c, ""]
    },
        g = function(t, e, n) {
        return "floatatom" === t ? (n.width = e[0], n.labelPos = e[3], n.label = e[4], e = [e[1], e[2], e[5], e[6]]) : "symbolatom" === t ? (n.width = e[0], n.labelPos = e[3], n.label = e[4], e = [e[1], e[2], e[5], e[6]]) : "bng" === t ? (n.size = e[0], n.hold = e[1], n.interrupt = e[2], n.label = e[6], n.labelX = e[7], n.labelY = e[8], n.labelFont = e[9], n.labelFontSize = e[10], n.bgColor = e[11], n.fgColor = e[12], n.labelColor = e[13], e = [e[3], e[4], e[5]]) : "tgl" === t ? (n.size = e[0], n.label = e[4], n.labelX = e[5], n.labelY = e[6], n.labelFont = e[7], n.labelFontSize = e[8], n.bgColor = e[9], n.fgColor = e[10], n.labelColor = e[11], e = [e[1], e[2], e[3], e[12], e[13]]) : "nbx" === t ? (n.size = e[0], n.height = e[1], n.log = e[4], n.label = e[8], n.labelX = e[9], n.labelY = e[10], n.labelFont = e[11], n.labelFontSize = e[12], n.bgColor = e[13], n.fgColor = e[14], n.labelColor = e[15], n.logHeight = e[17], e = [e[2], e[3], e[5], e[6], e[7], e[16]]) : "vsl" === t ? (n.width = e[0], n.height = e[1], n.log = e[4], n.label = e[8], n.labelX = e[9], n.labelY = e[10], n.labelFont = e[11], n.labelFontSize = e[12], n.bgColor = e[13], n.fgColor = e[14], n.labelColor = e[15], n.steadyOnClick = e[17], e = [e[2], e[3], e[5], e[6], e[7], e[2] + (e[3] - e[2]) * e[16] / 12700]) : "hsl" === t ? (n.width = e[0], n.height = e[1], n.log = e[4], n.label = e[8], n.labelX = e[9], n.labelY = e[10], n.labelFont = e[11], n.labelFontSize = e[12], n.bgColor = e[13], n.fgColor = e[14], n.labelColor = e[15], n.steadyOnClick = e[17], e = [e[2], e[3], e[5], e[6], e[7], e[2] + (e[3] - e[2]) * e[16] / 12700]) : "vradio" === t ? (n.size = e[0], n.label = e[6], n.labelX = e[7], n.labelY = e[8], n.labelFont = e[9], n.labelFontSize = e[10], n.bgColor = e[11], n.fgColor = e[12], n.labelColor = e[13], e = [e[1], e[2], e[3], e[4], e[5], e[14]]) : "hradio" === t ? (n.size = e[0], n.label = e[6], n.labelX = e[7], n.labelY = e[8], n.labelFont = e[9], n.labelFontSize = e[10], n.bgColor = e[11], n.fgColor = e[12], n.labelColor = e[13], e = [e[1], e[2], e[3], e[4], e[5], e[14]]) : "vu" === t ? (n.width = e[0], n.height = e[1], n.label = e[3], n.labelX = e[4], n.labelY = e[5], n.labelFont = e[6], n.labelFontSize = e[7], n.bgColor = e[8], n.labelColor = e[9], n.log = e[10], e = [e[2], e[11]]) : "cnv" === t && (n.size = e[0], n.width = e[1], n.height = e[2], n.label = e[5], n.labelX = e[6], n.labelY = e[7], n.labelFont = e[8], n.labelFontSize = e[9], n.bgColor = e[10], n.labelColor = e[11], e = [e[3], e[4], e[12]]), [e, n]
        }
  }, {
    underscore: 22
  }],
  22: [function(t, e, n) {
    (function() {
      var t = this,
          i = t._,
          o = {},
          s = Array.prototype,
          r = Object.prototype,
          a = Function.prototype,
          u = s.push,
          c = s.slice,
          l = s.concat,
          h = r.toString,
          f = r.hasOwnProperty,
          d = s.forEach,
          p = s.map,
          v = s.reduce,
          g = s.reduceRight,
          m = s.filter,
          _ = s.every,
          y = s.some,
          b = s.indexOf,
          x = s.lastIndexOf,
          w = Array.isArray,
          N = Object.keys,
          j = a.bind,
          T = function(t) {
          return t instanceof T ? t : this instanceof T ? void(this._wrapped = t) : new T(t)
          };
      "undefined" != typeof n ? ("undefined" != typeof e && e.exports && (n = e.exports = T), n._ = T) : t._ = T, T.VERSION = "1.4.4";
      var D = T.each = T.forEach = function(t, e, n) {
        if (null != t) if (d && t.forEach === d) t.forEach(e, n);
        else if (t.length === +t.length) {
          for (var i = 0, s = t.length; s > i; i++) if (e.call(n, t[i], i, t) === o) return
        } else
        for (var r in t) if (T.has(t, r) && e.call(n, t[r], r, t) === o) return
      };
      T.map = T.collect = function(t, e, n) {
        var i = [];
        return null == t ? i : p && t.map === p ? t.map(e, n) : (D(t, function(t, o, s) {
          i[i.length] = e.call(n, t, o, s)
        }), i)
      };
      var O = "Reduce of empty array with no initial value";
      T.reduce = T.foldl = T.inject = function(t, e, n, i) {
        var o = arguments.length > 2;
        if (null == t && (t = []), v && t.reduce === v) return i && (e = T.bind(e, i)), o ? t.reduce(e, n) : t.reduce(e);
        if (D(t, function(t, s, r) {
          o ? n = e.call(i, n, t, s, r) : (n = t, o = !0)
        }), !o) throw new TypeError(O);
        return n
      }, T.reduceRight = T.foldr = function(t, e, n, i) {
        var o = arguments.length > 2;
        if (null == t && (t = []), g && t.reduceRight === g) return i && (e = T.bind(e, i)), o ? t.reduceRight(e, n) : t.reduceRight(e);
        var s = t.length;
        if (s !== +s) {
          var r = T.keys(t);
          s = r.length
        }
        if (D(t, function(a, u, c) {
          u = r ? r[--s] : --s, o ? n = e.call(i, n, t[u], u, c) : (n = t[u], o = !0)
        }), !o) throw new TypeError(O);
        return n
      }, T.find = T.detect = function(t, e, n) {
        var i;
        return A(t, function(t, o, s) {
          return e.call(n, t, o, s) ? (i = t, !0) : void 0
        }), i
      }, T.filter = T.select = function(t, e, n) {
        var i = [];
        return null == t ? i : m && t.filter === m ? t.filter(e, n) : (D(t, function(t, o, s) {
          e.call(n, t, o, s) && (i[i.length] = t)
        }), i)
      }, T.reject = function(t, e, n) {
        return T.filter(t, function(t, i, o) {
          return !e.call(n, t, i, o)
        }, n)
      }, T.every = T.all = function(t, e, n) {
        e || (e = T.identity);
        var i = !0;
        return null == t ? i : _ && t.every === _ ? t.every(e, n) : (D(t, function(t, s, r) {
          return (i = i && e.call(n, t, s, r)) ? void 0 : o
        }), !! i)
      };
      var A = T.some = T.any = function(t, e, n) {
        e || (e = T.identity);
        var i = !1;
        return null == t ? i : y && t.some === y ? t.some(e, n) : (D(t, function(t, s, r) {
          return i || (i = e.call(n, t, s, r)) ? o : void 0
        }), !! i)
      };
      T.contains = T.include = function(t, e) {
        return null == t ? !1 : b && t.indexOf === b ? -1 != t.indexOf(e) : A(t, function(t) {
          return t === e
        })
      }, T.invoke = function(t, e) {
        var n = c.call(arguments, 2),
            i = T.isFunction(e);
        return T.map(t, function(t) {
          return (i ? e : t[e]).apply(t, n)
        })
      }, T.pluck = function(t, e) {
        return T.map(t, function(t) {
          return t[e]
        })
      }, T.where = function(t, e, n) {
        return T.isEmpty(e) ? n ? null : [] : T[n ? "find" : "filter"](t, function(t) {
          for (var n in e) if (e[n] !== t[n]) return !1;
          return !0
        })
      }, T.findWhere = function(t, e) {
        return T.where(t, e, !0)
      }, T.max = function(t, e, n) {
        if (!e && T.isArray(t) && t[0] === +t[0] && t.length < 65535) return Math.max.apply(Math, t);
        if (!e && T.isEmpty(t)) return -(1 / 0);
        var i = {
          computed: -(1 / 0),
          value: -(1 / 0)
        };
        return D(t, function(t, o, s) {
          var r = e ? e.call(n, t, o, s) : t;
          r >= i.computed && (i = {
            value: t,
            computed: r
          })
        }), i.value
      }, T.min = function(t, e, n) {
        if (!e && T.isArray(t) && t[0] === +t[0] && t.length < 65535) return Math.min.apply(Math, t);
        if (!e && T.isEmpty(t)) return 1 / 0;
        var i = {
          computed: 1 / 0,
          value: 1 / 0
        };
        return D(t, function(t, o, s) {
          var r = e ? e.call(n, t, o, s) : t;
          r < i.computed && (i = {
            value: t,
            computed: r
          })
        }), i.value
      }, T.shuffle = function(t) {
        var e, n = 0,
            i = [];
        return D(t, function(t) {
          e = T.random(n++), i[n - 1] = i[e], i[e] = t
        }), i
      };
      var E = function(t) {
        return T.isFunction(t) ? t : function(e) {
          return e[t]
        }
      };
      T.sortBy = function(t, e, n) {
        var i = E(e);
        return T.pluck(T.map(t, function(t, e, o) {
          return {
            value: t,
            index: e,
            criteria: i.call(n, t, e, o)
          }
        }).sort(function(t, e) {
          var n = t.criteria,
              i = e.criteria;
          if (n !== i) {
            if (n > i || void 0 === n) return 1;
            if (i > n || void 0 === i) return -1
          }
          return t.index < e.index ? -1 : 1
        }), "value")
      };
      var C = function(t, e, n, i) {
        var o = {},
            s = E(e || T.identity);
        return D(t, function(e, r) {
          var a = s.call(n, e, r, t);
          i(o, a, e)
        }), o
      };
      T.groupBy = function(t, e, n) {
        return C(t, e, n, function(t, e, n) {
          (T.has(t, e) ? t[e] : t[e] = []).push(n)
        })
      }, T.countBy = function(t, e, n) {
        return C(t, e, n, function(t, e) {
          T.has(t, e) || (t[e] = 0), t[e]++
        })
      }, T.sortedIndex = function(t, e, n, i) {
        n = null == n ? T.identity : E(n);
        for (var o = n.call(i, e), s = 0, r = t.length; r > s;) {
          var a = s + r >>> 1;
          n.call(i, t[a]) < o ? s = a + 1 : r = a
        }
        return s
      }, T.toArray = function(t) {
        return t ? T.isArray(t) ? c.call(t) : t.length === +t.length ? T.map(t, T.identity) : T.values(t) : []
      }, T.size = function(t) {
        return null == t ? 0 : t.length === +t.length ? t.length : T.keys(t).length
      }, T.first = T.head = T.take = function(t, e, n) {
        return null == t ? void 0 : null == e || n ? t[0] : c.call(t, 0, e)
      }, T.initial = function(t, e, n) {
        return c.call(t, 0, t.length - (null == e || n ? 1 : e))
      }, T.last = function(t, e, n) {
        return null == t ? void 0 : null == e || n ? t[t.length - 1] : c.call(t, Math.max(t.length - e, 0))
      }, T.rest = T.tail = T.drop = function(t, e, n) {
        return c.call(t, null == e || n ? 1 : e)
      }, T.compact = function(t) {
        return T.filter(t, T.identity)
      };
      var k = function(t, e, n) {
        return D(t, function(t) {
          T.isArray(t) ? e ? u.apply(n, t) : k(t, e, n) : n.push(t)
        }), n
      };
      T.flatten = function(t, e) {
        return k(t, e, [])
      }, T.without = function(t) {
        return T.difference(t, c.call(arguments, 1))
      }, T.uniq = T.unique = function(t, e, n, i) {
        T.isFunction(e) && (i = n, n = e, e = !1);
        var o = n ? T.map(t, n, i) : t,
            s = [],
            r = [];
        return D(o, function(n, i) {
          (e ? i && r[r.length - 1] === n : T.contains(r, n)) || (r.push(n), s.push(t[i]))
        }), s
      }, T.union = function() {
        return T.uniq(l.apply(s, arguments))
      }, T.intersection = function(t) {
        var e = c.call(arguments, 1);
        return T.filter(T.uniq(t), function(t) {
          return T.every(e, function(e) {
            return T.indexOf(e, t) >= 0
          })
        })
      }, T.difference = function(t) {
        var e = l.apply(s, c.call(arguments, 1));
        return T.filter(t, function(t) {
          return !T.contains(e, t)
        })
      }, T.zip = function() {
        for (var t = c.call(arguments), e = T.max(T.pluck(t, "length")), n = new Array(e), i = 0; e > i; i++) n[i] = T.pluck(t, "" + i);
        return n
      }, T.object = function(t, e) {
        if (null == t) return {};
        for (var n = {}, i = 0, o = t.length; o > i; i++) e ? n[t[i]] = e[i] : n[t[i][0]] = t[i][1];
        return n
      }, T.indexOf = function(t, e, n) {
        if (null == t) return -1;
        var i = 0,
            o = t.length;
        if (n) {
          if ("number" != typeof n) return i = T.sortedIndex(t, e), t[i] === e ? i : -1;
          i = 0 > n ? Math.max(0, o + n) : n
        }
        if (b && t.indexOf === b) return t.indexOf(e, n);
        for (; o > i; i++) if (t[i] === e) return i;
        return -1
      }, T.lastIndexOf = function(t, e, n) {
        if (null == t) return -1;
        var i = null != n;
        if (x && t.lastIndexOf === x) return i ? t.lastIndexOf(e, n) : t.lastIndexOf(e);
        for (var o = i ? n : t.length; o--;) if (t[o] === e) return o;
        return -1
      }, T.range = function(t, e, n) {
        arguments.length <= 1 && (e = t || 0, t = 0), n = arguments[2] || 1;
        for (var i = Math.max(Math.ceil((e - t) / n), 0), o = 0, s = new Array(i); i > o;) s[o++] = t, t += n;
        return s
      }, T.bind = function(t, e) {
        if (t.bind === j && j) return j.apply(t, c.call(arguments, 1));
        var n = c.call(arguments, 2);
        return function() {
          return t.apply(e, n.concat(c.call(arguments)))
        }
      }, T.partial = function(t) {
        var e = c.call(arguments, 1);
        return function() {
          return t.apply(this, e.concat(c.call(arguments)))
        }
      }, T.bindAll = function(t) {
        var e = c.call(arguments, 1);
        return 0 === e.length && (e = T.functions(t)), D(e, function(e) {
          t[e] = T.bind(t[e], t)
        }), t
      }, T.memoize = function(t, e) {
        var n = {};
        return e || (e = T.identity), function() {
          var i = e.apply(this, arguments);
          return T.has(n, i) ? n[i] : n[i] = t.apply(this, arguments)
        }
      }, T.delay = function(t, e) {
        var n = c.call(arguments, 2);
        return setTimeout(function() {
          return t.apply(null, n)
        }, e)
      }, T.defer = function(t) {
        return T.delay.apply(T, [t, 1].concat(c.call(arguments, 1)))
      }, T.throttle = function(t, e) {
        var n, i, o, s, r = 0,
            a = function() {
            r = new Date, o = null, s = t.apply(n, i)
            };
        return function() {
          var u = new Date,
              c = e - (u - r);
          return n = this, i = arguments, 0 >= c ? (clearTimeout(o), o = null, r = u, s = t.apply(n, i)) : o || (o = setTimeout(a, c)), s
        }
      }, T.debounce = function(t, e, n) {
        var i, o;
        return function() {
          var s = this,
              r = arguments,
              a = function() {
              i = null, n || (o = t.apply(s, r))
              },
              u = n && !i;
          return clearTimeout(i), i = setTimeout(a, e), u && (o = t.apply(s, r)), o
        }
      }, T.once = function(t) {
        var e, n = !1;
        return function() {
          return n ? e : (n = !0, e = t.apply(this, arguments), t = null, e)
        }
      }, T.wrap = function(t, e) {
        return function() {
          var n = [t];
          return u.apply(n, arguments), e.apply(this, n)
        }
      }, T.compose = function() {
        var t = arguments;
        return function() {
          for (var e = arguments, n = t.length - 1; n >= 0; n--) e = [t[n].apply(this, e)];
          return e[0]
        }
      }, T.after = function(t, e) {
        return 0 >= t ? e() : function() {
          return --t < 1 ? e.apply(this, arguments) : void 0
        }
      }, T.keys = N ||
      function(t) {
        if (t !== Object(t)) throw new TypeError("Invalid object");
        var e = [];
        for (var n in t) T.has(t, n) && (e[e.length] = n);
        return e
      }, T.values = function(t) {
        var e = [];
        for (var n in t) T.has(t, n) && e.push(t[n]);
        return e
      }, T.pairs = function(t) {
        var e = [];
        for (var n in t) T.has(t, n) && e.push([n, t[n]]);
        return e
      }, T.invert = function(t) {
        var e = {};
        for (var n in t) T.has(t, n) && (e[t[n]] = n);
        return e
      }, T.functions = T.methods = function(t) {
        var e = [];
        for (var n in t) T.isFunction(t[n]) && e.push(n);
        return e.sort()
      }, T.extend = function(t) {
        return D(c.call(arguments, 1), function(e) {
          if (e) for (var n in e) t[n] = e[n]
        }), t
      }, T.pick = function(t) {
        var e = {},
            n = l.apply(s, c.call(arguments, 1));
        return D(n, function(n) {
          n in t && (e[n] = t[n])
        }), e
      }, T.omit = function(t) {
        var e = {},
            n = l.apply(s, c.call(arguments, 1));
        for (var i in t) T.contains(n, i) || (e[i] = t[i]);
        return e
      }, T.defaults = function(t) {
        return D(c.call(arguments, 1), function(e) {
          if (e) for (var n in e) null == t[n] && (t[n] = e[n])
        }), t
      }, T.clone = function(t) {
        return T.isObject(t) ? T.isArray(t) ? t.slice() : T.extend({}, t) : t
      }, T.tap = function(t, e) {
        return e(t), t
      };
      var I = function(t, e, n, i) {
        if (t === e) return 0 !== t || 1 / t == 1 / e;
        if (null == t || null == e) return t === e;
        t instanceof T && (t = t._wrapped), e instanceof T && (e = e._wrapped);
        var o = h.call(t);
        if (o != h.call(e)) return !1;
        switch (o) {
        case "[object String]":
          return t == String(e);
        case "[object Number]":
          return t != +t ? e != +e : 0 == t ? 1 / t == 1 / e : t == +e;
        case "[object Date]":
        case "[object Boolean]":
          return +t == +e;
        case "[object RegExp]":
          return t.source == e.source && t.global == e.global && t.multiline == e.multiline && t.ignoreCase == e.ignoreCase
        }
        if ("object" != typeof t || "object" != typeof e) return !1;
        for (var s = n.length; s--;) if (n[s] == t) return i[s] == e;
        n.push(t), i.push(e);
        var r = 0,
            a = !0;
        if ("[object Array]" == o) {
          if (r = t.length, a = r == e.length) for (; r-- && (a = I(t[r], e[r], n, i)););
        } else {
          var u = t.constructor,
              c = e.constructor;
          if (u !== c && !(T.isFunction(u) && u instanceof u && T.isFunction(c) && c instanceof c)) return !1;
          for (var l in t) if (T.has(t, l) && (r++, !(a = T.has(e, l) && I(t[l], e[l], n, i)))) break;
          if (a) {
            for (l in e) if (T.has(e, l) && !r--) break;
            a = !r
          }
        }
        return n.pop(), i.pop(), a
      };
      T.isEqual = function(t, e) {
        return I(t, e, [], [])
      }, T.isEmpty = function(t) {
        if (null == t) return !0;
        if (T.isArray(t) || T.isString(t)) return 0 === t.length;
        for (var e in t) if (T.has(t, e)) return !1;
        return !0
      }, T.isElement = function(t) {
        return !(!t || 1 !== t.nodeType)
      }, T.isArray = w ||
      function(t) {
        return "[object Array]" == h.call(t)
      }, T.isObject = function(t) {
        return t === Object(t)
      }, D(["Arguments", "Function", "String", "Number", "Date", "RegExp"], function(t) {
        T["is" + t] = function(e) {
          return h.call(e) == "[object " + t + "]"
        }
      }), T.isArguments(arguments) || (T.isArguments = function(t) {
        return !(!t || !T.has(t, "callee"))
      }), "function" != typeof / . / && (T.isFunction = function(t) {
        return "function" == typeof t
      }), T.isFinite = function(t) {
        return isFinite(t) && !isNaN(parseFloat(t))
      }, T.isNaN = function(t) {
        return T.isNumber(t) && t != +t
      }, T.isBoolean = function(t) {
        return t === !0 || t === !1 || "[object Boolean]" == h.call(t)
      }, T.isNull = function(t) {
        return null === t
      }, T.isUndefined = function(t) {
        return void 0 === t
      }, T.has = function(t, e) {
        return f.call(t, e)
      }, T.noConflict = function() {
        return t._ = i, this
      }, T.identity = function(t) {
        return t
      }, T.times = function(t, e, n) {
        for (var i = Array(t), o = 0; t > o; o++) i[o] = e.call(n, o);
        return i
      }, T.random = function(t, e) {
        return null == e && (e = t, t = 0), t + Math.floor(Math.random() * (e - t + 1))
      };
      var M = {
        escape: {
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#x27;",
          "/": "&#x2F;"
        }
      };
      M.unescape = T.invert(M.escape);
      var S = {
        escape: new RegExp("[" + T.keys(M.escape).join("") + "]", "g"),
        unescape: new RegExp("(" + T.keys(M.unescape).join("|") + ")", "g")
      };
      T.each(["escape", "unescape"], function(t) {
        T[t] = function(e) {
          return null == e ? "" : ("" + e).replace(S[t], function(e) {
            return M[t][e]
          })
        }
      }), T.result = function(t, e) {
        if (null == t) return null;
        var n = t[e];
        return T.isFunction(n) ? n.call(t) : n
      }, T.mixin = function(t) {
        D(T.functions(t), function(e) {
          var n = T[e] = t[e];
          T.prototype[e] = function() {
            var t = [this._wrapped];
            return u.apply(t, arguments), L.call(this, n.apply(T, t))
          }
        })
      };
      var R = 0;
      T.uniqueId = function(t) {
        var e = ++R + "";
        return t ? t + e : e
      }, T.templateSettings = {
        evaluate: /<%([\s\S]+?)%>/g,
        interpolate: /<%=([\s\S]+?)%>/g,
        escape: /<%-([\s\S]+?)%>/g
      };
      var P = /(.)^/,
          W = {
          "'": "'",
          "\\": "\\",
          "\r": "r",
          "\n": "n",
          "	": "t",
          "\u2028": "u2028",
          "\u2029": "u2029"
          },
          q = /\\|'|\r|\n|\t|\u2028|\u2029/g;
      T.template = function(t, e, n) {
        var i;
        n = T.defaults({}, n, T.templateSettings);
        var o = new RegExp([(n.escape || P).source, (n.interpolate || P).source, (n.evaluate || P).source].join("|") + "|$", "g"),
            s = 0,
            r = "__p+='";
        t.replace(o, function(e, n, i, o, a) {
          return r += t.slice(s, a).replace(q, function(t) {
            return "\\" + W[t]
          }), n && (r += "'+\n((__t=(" + n + "))==null?'':_.escape(__t))+\n'"), i && (r += "'+\n((__t=(" + i + "))==null?'':__t)+\n'"), o && (r += "';\n" + o + "\n__p+='"), s = a + e.length, e
        }), r += "';\n", n.variable || (r = "with(obj||{}){\n" + r + "}\n"), r = "var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n" + r + "return __p;\n";
        try {
          i = new Function(n.variable || "obj", "_", r)
        } catch (a) {
          throw a.source = r, a
        }
        if (e) return i(e, T);
        var u = function(t) {
          return i.call(this, t, T)
        };
        return u.source = "function(" + (n.variable || "obj") + "){\n" + r + "}", u
      }, T.chain = function(t) {
        return T(t).chain()
      };
      var L = function(t) {
        return this._chain ? T(t).chain() : t
      };
      T.mixin(T), D(["pop", "push", "reverse", "shift", "sort", "splice", "unshift"], function(t) {
        var e = s[t];
        T.prototype[t] = function() {
          var n = this._wrapped;
          return e.apply(n, arguments), "shift" != t && "splice" != t || 0 !== n.length || delete n[0], L.call(this, n)
        }
      }), D(["concat", "join", "slice"], function(t) {
        var e = s[t];
        T.prototype[t] = function() {
          return L.call(this, e.apply(this._wrapped, arguments))
        }
      }), T.extend(T.prototype, {
        chain: function() {
          return this._chain = !0, this
        },
        value: function() {
          return this._wrapped
        }
      })
    }).call(this)
  }, {}],
  23: [function(t, e, n) {
    var i = t("./lib/WAAClock");
    e.exports = i, "undefined" != typeof window && (window.WAAClock = i)
  }, {
    "./lib/WAAClock": 24
  }],
  24: [function(t, e, n) {
    (function(t) {
      var n = ("undefined" != typeof window, {
        toleranceLate: .1,
        toleranceEarly: .001
      }),
          i = function(t, e, n) {
          this.clock = t, this.func = n, this._cleared = !1, this.toleranceLate = t.toleranceLate, this.toleranceEarly = t.toleranceEarly, this._latestTime = null, this._earliestTime = null, this.deadline = null, this.repeatTime = null, this.schedule(e)
          };
      i.prototype.clear = function() {
        return this.clock._removeEvent(this), this._cleared = !0, this
      }, i.prototype.repeat = function(t) {
        if (0 === t) throw new Error("delay cannot be 0");
        return this.repeatTime = t, this.clock._hasEvent(this) || this.schedule(this.deadline + this.repeatTime), this
      }, i.prototype.tolerance = function(t) {
        return "number" == typeof t.late && (this.toleranceLate = t.late), "number" == typeof t.early && (this.toleranceEarly = t.early), this._refreshEarlyLateDates(), this.clock._hasEvent(this) && (this.clock._removeEvent(this), this.clock._insertEvent(this)), this
      }, i.prototype.isRepeated = function() {
        return null !== this.repeatTime
      }, i.prototype.schedule = function(t) {
        this._cleared = !1, this.deadline = t, this._refreshEarlyLateDates(), this.clock.context.currentTime >= this._earliestTime ? this._execute() : this.clock._hasEvent(this) ? (this.clock._removeEvent(this), this.clock._insertEvent(this)) : this.clock._insertEvent(this)
      }, i.prototype.timeStretch = function(t, e) {
        this.isRepeated() && (this.repeatTime = this.repeatTime * e);
        var n = t + e * (this.deadline - t);
        if (this.isRepeated()) for (; this.clock.context.currentTime >= n - this.toleranceEarly;) n += this.repeatTime;
        this.schedule(n)
      }, i.prototype._execute = function() {
        this.clock._started !== !1 && (this.clock._removeEvent(this), this.clock.context.currentTime < this._latestTime ? this.func(this) : (this.onexpired && this.onexpired(this), console.warn("event expired")), this.clock._hasEvent(this) || !this.isRepeated() || this._cleared || this.schedule(this.deadline + this.repeatTime))
      }, i.prototype._refreshEarlyLateDates = function() {
        this._latestTime = this.deadline + this.toleranceLate, this._earliestTime = this.deadline - this.toleranceEarly
      };
      var o = e.exports = function(t, e) {
        e = e || {}, this.tickMethod = e.tickMethod || "ScriptProcessorNode", this.toleranceEarly = e.toleranceEarly || n.toleranceEarly, this.toleranceLate = e.toleranceLate || n.toleranceLate, this.context = t, this._events = [], this._started = !1
      };
      o.prototype.setTimeout = function(t, e) {
        return this._createEvent(t, this._absTime(e))
      }, o.prototype.callbackAtTime = function(t, e) {
        return this._createEvent(t, e)
      }, o.prototype.timeStretch = function(t, e, n) {
        return e.forEach(function(e) {
          e.timeStretch(t, n)
        }), e
      }, o.prototype.start = function() {
        if (this._started === !1) {
          var e = this;
          if (this._started = !0, this._events = [], "ScriptProcessorNode" === this.tickMethod) {
            var n = 256;
            this._clockNode = this.context.createScriptProcessor(n, 1, 1), this._clockNode.connect(this.context.destination), this._clockNode.onaudioprocess = function() {
              t.nextTick(function() {
                e._tick()
              })
            }
          } else if ("manual" !== this.tickMethod) throw new Error("invalid tickMethod " + this.tickMethod)
        }
      }, o.prototype.stop = function() {
        this._started === !0 && (this._started = !1, this._clockNode.disconnect())
      }, o.prototype._tick = function() {
        for (var t = this._events.shift(); t && t._earliestTime <= this.context.currentTime;) t._execute(), t = this._events.shift();
        t && this._events.unshift(t)
      }, o.prototype._createEvent = function(t, e) {
        return new i(this, e, t)
      }, o.prototype._insertEvent = function(t) {
        this._events.splice(this._indexByTime(t._earliestTime), 0, t)
      }, o.prototype._removeEvent = function(t) {
        var e = this._events.indexOf(t); - 1 !== e && this._events.splice(e, 1)
      }, o.prototype._hasEvent = function(t) {
        return -1 !== this._events.indexOf(t)
      }, o.prototype._indexByTime = function(t) {
        for (var e, n = 0, i = this._events.length; i > n;) e = Math.floor((n + i) / 2), this._events[e]._earliestTime < t ? n = e + 1 : i = e;
        return n
      }, o.prototype._absTime = function(t) {
        return t + this.context.currentTime
      }, o.prototype._relTime = function(t) {
        return t - this.context.currentTime
      }
    }).call(this, t("_process"))
  }, {
    _process: 18
  }],
  25: [function(t, e, n) {
    var i = t("./lib/WAAOffsetNode");
    e.exports = i, "undefined" != typeof window && (window.WAAOffsetNode = i)
  }, {
    "./lib/WAAOffsetNode": 26
  }],
  26: [function(t, e, n) {
    var i = e.exports = function(t) {
      this.context = t, this._ones = i._ones.filter(function(e) {
        return e.context === t
      })[0], this._ones ? this._ones = this._ones.ones : (this._ones = t.createOscillator(), this._ones.frequency.value = 0, this._ones.setPeriodicWave(t.createPeriodicWave(new Float32Array([0, 1]), new Float32Array([0, 0]))), this._ones.start(0), i._ones.push({
        context: t,
        ones: this._ones
      })), this._output = t.createGain(), this._ones.connect(this._output), this.offset = this._output.gain, this.offset.value = 0
    };
    i.prototype.connect = function() {
      this._output.connect.apply(this._output, arguments)
    }, i.prototype.disconnect = function() {
      this._output.disconnect.apply(this._output, arguments)
    }, i._ones = []
  }, {}],
  27: [function(t, e, n) {
    var i = t("./lib/WAATableNode");
    e.exports = i, "undefined" != typeof window && (window.WAATableNode = i)
  }, {
    "./lib/WAATableNode": 28
  }],
  28: [function(t, e, n) {
    var i = t("waaoffset"),
        o = e.exports = function(t) {
        this.context = t, this._output = t.createWaveShaper(), this._positionNode = new i(t), this._positionNode.connect(this._output), this._positionNode.offset.value = -1, this.position = t.createGain(), this.position.connect(this._positionNode.offset), this.position.gain.value = 0, this._table = null, Object.defineProperty(this, "table", {
          get: function() {
            return this._table
          },
          set: function(t) {
            this._setTable(t)
          }
        })
        };
    o.prototype.connect = function() {
      this._output.connect.apply(this._output, arguments)
    }, o.prototype.disconnect = function() {
      this._output.disconnect.apply(this._output, arguments)
    }, o.prototype._setTable = function(t) {
      t instanceof AudioBuffer && (t = t.getChannelData(0)), this._table = t, null !== t && (this._output.curve = t, this.position.gain.setValueAtTime(2 / (t.length - 1), 0))
    }
  }, {
    waaoffset: 29
  }],
  29: [function(t, e, n) {
    var i = t("./lib/WAAOffset");
    e.exports = i, "undefined" != typeof window && (window.WAAOffset = i)
  }, {
    "./lib/WAAOffset": 30
  }],
  30: [function(t, e, n) {
    var i = e.exports = function(t) {
      this.context = t, this._ones = t.createOscillator(), this._ones.frequency.value = 0, this._ones.setPeriodicWave(t.createPeriodicWave(new Float32Array([0, 1]), new Float32Array([0, 0]))), this._ones.start(0), this._output = t.createGain(), this._ones.connect(this._output), this.offset = this._output.gain, this.offset.value = 0
    };
    i.prototype.connect = function() {
      this._output.connect.apply(this._output, arguments)
    }, i.prototype.disconnect = function() {
      this._output.disconnect.apply(this._output, arguments)
    }
  }, {}],
  31: [function(t, e, n) {
    var i = t("./lib/WAAWhiteNoiseNode");
    e.exports = i, "undefined" != typeof window && (window.WAAWhiteNoiseNode = i)
  }, {
    "./lib/WAAWhiteNoiseNode": 32
  }],
  32: [function(t, e, n) {
    var i = e.exports = function(t) {
      this.context = t, this._buffer = t.createBuffer(1, 131072, t.sampleRate);
      var e, n = this._buffer.getChannelData(0);
      for (e = 0; 131072 > e; e++) n[e] = 2 * Math.random() - 1;
      this._prepareOutput()
    };
    i.prototype.connect = function() {
      this._output.connect.apply(this._output, arguments)
    }, i.prototype.disconnect = function() {
      this._output.disconnect.apply(this._output, arguments)
    }, i.prototype.start = function() {
      this._output.start.apply(this._output, arguments)
    }, i.prototype.stop = function() {
      this._output.stop.apply(this._output, arguments), this._prepareOutput()
    }, i.prototype._prepareOutput = function() {
      this._output = this.context.createBufferSource(), this._output.buffer = this._buffer, this._output.loop = !0
    }
  }, {}],
  33: [function(t, e, n) {
    var i = t("./lib/WAAWire");
    e.exports = i, "undefined" != typeof window && (window.WAAWire = i)
  }, {
    "./lib/WAAWire": 34
  }],
  34: [function(t, e, n) {
    var i = e.exports = function(t) {
      this.context = t, this._source = null, this._output = null, this._destination = null, this._input = null, this._gainNode = null, this._discardedGainNode = null, this._atTime = 0, this._closed = !1
    },
        o = function(t) {
        return function() {
          return this._clean(), this[t].apply(this, [this._atTime].concat([].slice.call(arguments, 0))), this._atTime = 0, this
        }
        };
    i.prototype.connect = o("_connect"), i.prototype.swapSource = o("_swapSource"), i.prototype.swapDestination = o("_swapDestination"), i.prototype.close = o("_close"), i.prototype.atTime = function(t) {
      return this._atTime = t, this
    }, i.prototype._connect = function(t, e, n, i, o) {
      if (this._gainNode) throw new Error("Wire already connected");
      this._source = e, this._destination = n, this._output = i || 0, this._input = o || 0, this._doConnections(t)
    }, i.prototype._swapSource = function(t, e, n) {
      this._discardedGainNode = this._gainNode, this._discardedGainNode.gain.setValueAtTime(0, t), this._source = e, this._output = n || 0, this._doConnections(t)
    }, i.prototype._swapDestination = function(t, e, n) {
      this._discardedGainNode = this._gainNode, this._discardedGainNode.gain.setValueAtTime(0, t), this._destination = e, this._input = n || 0, this._doConnections(t)
    }, i.prototype._close = function(t) {
      if (this._closed === !0) throw new Error("Wire already closed");
      this._discardedGainNode = this._gainNode, this._gainNode.gain.setValueAtTime(0, t), this._gainNode = null, this._closed = !0
    }, i.prototype._doConnections = function(t) {
      var e = this.context.createGain();
      e.gain.setValueAtTime(0, 0), e.gain.setValueAtTime(1, t), this._gainNode = e, this._source.connect(e, this._output), this._destination instanceof AudioParam ? e.connect(this._destination, 0) : e.connect(this._destination, 0, this._input)
    }, i.prototype._clean = function() {
      this._discardedGainNode && 0 === this._discardedGainNode.gain.value && (this._discardedGainNode.disconnect(), this._discardedGainNode = null)
    };
    var s = function() {
      if ("undefined" != typeof window && window.OfflineAudioContext) {
        var t = new OfflineAudioContext(1, 1, 44100),
            e = t.createBufferSource(),
            n = t.createGain(),
            i = t.createBuffer(1, 1, 44100);
        i.getChannelData(0)[0] = 1, e.buffer = i, e.connect(n), e.connect(t.destination), e.start(0), n.connect(t.destination), e.disconnect(n), t.oncomplete = function(t) {
          r = !! t.renderedBuffer.getChannelData(0)[0]
        }, t.startRendering()
      }
    },
        r = null;
    s()
  }, {}]
}, {}, [1]);
