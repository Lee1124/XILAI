!
  function (t, e) {
    "object" == typeof exports && "object" == typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define([], e) : "object" == typeof exports ? exports.COS = e() : t.COS = e()
  }(this,
    function () {
      return function (t) {
        function e(r) {
          if (n[r]) return n[r].exports;
          var o = n[r] = {
            i: r,
            l: !1,
            exports: {}
          };
          return t[r].call(o.exports, o, o.exports, e),
            o.l = !0,
            o.exports
        }
        var n = {};
        return e.m = t,
          e.c = n,
          e.d = function (t, n, r) {
            e.o(t, n) || Object.defineProperty(t, n, {
              configurable: !1,
              enumerable: !0,
              get: r
            })
          },
          e.n = function (t) {
            var n = t && t.__esModule ?
              function () {
                return t.
                  default
              } :
              function () {
                return t
              };
            return e.d(n, "a", n),
              n
          },
          e.o = function (t, e) {
            return Object.prototype.hasOwnProperty.call(t, e)
          },
          e.p = "D:\\github\\cos-wx-sdk-v5\\demo\\lib",
          e(e.s = 2)
      }([function (t, e, n) {
        "use strict"; (function (e) {
          function r(t) {
            return encodeURIComponent(t).replace(/!/g, "%21").replace(/'/g, "%27").replace(/\(/g, "%28").replace(/\)/g, "%29").replace(/\*/g, "%2A")
          }
          function o(t) {
            return u(t,
              function (t) {
                return "object" == typeof t ? o(t) : t
              })
          }
          function i(t, e) {
            return s(e,
              function (n, r) {
                t[r] = e[r]
              }),
              t
          }
          function a(t) {
            return t instanceof Array
          }
          function s(t, e) {
            for (var n in t) t.hasOwnProperty(n) && e(t[n], n)
          }
          function u(t, e) {
            var n = a(t) ? [] : {};
            for (var r in t) t.hasOwnProperty(r) && (n[r] = e(t[r], r));
            return n
          }
          var c = n(8),
            l = n(9),
            f = n(10),
            h = n(11),
            d = function (t) {
              t = t || {};
              var e = t.SecretId,
                n = t.SecretKey,
                o = (t.method || t.Method || "get").toLowerCase(),
                i = t.pathname || t.Key || "/",
                a = t.params || "",
                s = t.headers || "";
              if (0 !== i.indexOf("/") && (i = "/" + i), !e) return console.error("lack of param SecretId");
              if (!n) return console.error("lack of param SecretKey");
              var u = function (t) {
                var e = [];
                for (var n in t) t.hasOwnProperty(n) && e.push(n);
                return e.sort()
              },
                c = function (t) {
                  var e, n, o, i = [],
                    a = u(t);
                  for (e = 0; e < a.length; e++) n = a[e],
                    o = t[n] || "",
                    n = n.toLowerCase(),
                    i.push(r(n) + "=" + r(o));
                  return i.join("&")
                },
                f = parseInt((new Date).getTime() / 1e3) - 1,
                h = f,
                d = t.Expires || t.expires;
              h += void 0 === d ? 900 : 1 * d || 0;
              var p = e,
                g = f + ";" + h,
                y = f + ";" + h,
                v = u(s).join(";").toLowerCase(),
                C = u(a).join(";").toLowerCase(),
                m = l.HmacSHA1(y, n).toString(),
                A = [o, i, c(a), c(s), ""].join("\n"),
                _ = ["sha1", g, l.SHA1(A).toString(), ""].join("\n");
              return ["q-sign-algorithm=sha1", "q-ak=" + p, "q-sign-time=" + g, "q-key-time=" + y, "q-header-list=" + v, "q-url-param-list=" + C, "q-signature=" + l.HmacSHA1(_, m).toString()].join("&")
            },
            p = function (t) {
              var e = {};
              for (var n in t) void 0 !== t[n] && null !== t[n] && (e[n] = t[n]);
              return e
            },
            g = function (t) {
              var n, r, o, i = [];
              for (n = 0, r = t.length / 2; n < r; n++) o = parseInt(t[2 * n] + t[2 * n + 1], 16),
                i.push(o);
              return new e(i).toString("base64")
            },
            y = function () {
              var t = function () {
                return (65536 * (1 + Math.random()) | 0).toString(16).substring(1)
              };
              return t() + t() + "-" + t() + "-" + t() + "-" + t() + "-" + t() + t() + t()
            },
            v = function (t, e) {
              var n = e.Bucket,
                r = e.Region,
                o = e.Key;
              return t.indexOf("Bucket") > -1 || "deleteMultipleObject" === t || "multipartList" === t ? n && r : !(t.indexOf("Object") > -1 || t.indexOf("multipart") > -1 || "sliceUploadFile" === t || "abortUploadTask" === t) || n && r && o
            },
            C = function (t, e) {
              var n = {
                gz: "ap-guangzhou",
                tj: "ap-beijing-2",
                sh: "ap-shanghai",
                cd: "ap-chengdu"
              };
              return function (r, o) {
                if (o = o ||
                  function () { },
                  "getService" !== t && "abortUploadTask" !== t) {
                  if (!v(t, r)) return void o({
                    error: "lack of required params"
                  });
                  if (r.Region && n[r.Region]) return void o({
                    error: "Region should be " + n[r.Region]
                  });
                  if (r.Region && r.Region.indexOf("cos.") > -1) return void o({
                    error: 'Region should not be start with "cos."'
                  });
                  if (r.Bucket) {
                    if (!/^(.+)-(\d+)$/.test(r.Bucket)) if (r.AppId) r.Bucket = r.Bucket + "-" + r.AppId;
                    else {
                      if (!this.options.AppId) return void o({
                        error: 'Bucket should format as "test-1250000000".'
                      });
                      r.Bucket = r.Bucket + "-" + this.options.AppId
                    }
                    r.AppId && (console.warn('warning: AppId has been deprecated, Please put it at the end of parameter Bucket(E.g Bucket:"test-1250000000" ).'), delete r.AppId)
                  }
                  r.Key && "/" === r.Key.substr(0, 1) && (r.Key = r.Key.substr(1))
                }
                var i = e.call(this, r, o);
                if ("getAuth" === t || "getObjectUrl" === t) return i
              }
            },
            m = function (t, e) {
              function n() {
                if (o = 0, e && "function" == typeof e) {
                  r = Date.now();
                  var n, i = Math.max(0, Math.round((s - a) / ((r - u) / 1e3) * 100) / 100);
                  n = 0 === s && 0 === t ? 1 : Math.round(s / t * 100) / 100 || 0,
                    u = r,
                    a = s;
                  try {
                    e({
                      loaded: s,
                      total: t,
                      speed: i,
                      percent: n
                    })
                  } catch (t) { }
                }
              }
              var r, o, i = this,
                a = 0,
                s = 0,
                u = Date.now();
              return function (e, r) {
                if (e && (s = e.loaded, t = e.total), r) clearTimeout(o),
                  n();
                else {
                  if (o) return;
                  o = setTimeout(n, i.options.ProgressInterval)
                }
              }
            },
            A = {
              apiWrapper: C,
              getAuth: d,
              xml2json: f,
              json2xml: h,
              md5: c,
              clearKey: p,
              binaryBase64: g,
              extend: i,
              isArray: a,
              each: s,
              map: u,
              clone: o,
              uuid: y,
              throttleOnProgress: m
            };
          t.exports = A
        }).call(e, n(1).Buffer)
      },
      function (t, e, n) {
        "use strict"; (function (t) {
          function r() {
            return i.TYPED_ARRAY_SUPPORT ? 2147483647 : 1073741823
          }
          function o(t, e) {
            if (r() < e) throw new RangeError("Invalid typed array length");
            return i.TYPED_ARRAY_SUPPORT ? (t = new Uint8Array(e), t.__proto__ = i.prototype) : (null === t && (t = new i(e)), t.length = e),
              t
          }
          function i(t, e, n) {
            if (!(i.TYPED_ARRAY_SUPPORT || this instanceof i)) return new i(t, e, n);
            if ("number" == typeof t) {
              if ("string" == typeof e) throw new Error("If encoding is specified then the first argument must be a string");
              return c(this, t)
            }
            return a(this, t, e, n)
          }
          function a(t, e, n, r) {
            if ("number" == typeof e) throw new TypeError('"value" argument must not be a number');
            return "undefined" != typeof ArrayBuffer && e instanceof ArrayBuffer ? h(t, e, n, r) : "string" == typeof e ? l(t, e, n) : d(t, e)
          }
          function s(t) {
            if ("number" != typeof t) throw new TypeError('"size" argument must be a number');
            if (t < 0) throw new RangeError('"size" argument must not be negative')
          }
          function u(t, e, n, r) {
            return s(e),
              e <= 0 ? o(t, e) : void 0 !== n ? "string" == typeof r ? o(t, e).fill(n, r) : o(t, e).fill(n) : o(t, e)
          }
          function c(t, e) {
            if (s(e), t = o(t, e < 0 ? 0 : 0 | p(e)), !i.TYPED_ARRAY_SUPPORT) for (var n = 0; n < e; ++n) t[n] = 0;
            return t
          }
          function l(t, e, n) {
            if ("string" == typeof n && "" !== n || (n = "utf8"), !i.isEncoding(n)) throw new TypeError('"encoding" must be a valid string encoding');
            var r = 0 | y(e, n);
            t = o(t, r);
            var a = t.write(e, n);
            return a !== r && (t = t.slice(0, a)),
              t
          }
          function f(t, e) {
            var n = e.length < 0 ? 0 : 0 | p(e.length);
            t = o(t, n);
            for (var r = 0; r < n; r += 1) t[r] = 255 & e[r];
            return t
          }
          function h(t, e, n, r) {
            if (e.byteLength, n < 0 || e.byteLength < n) throw new RangeError("'offset' is out of bounds");
            if (e.byteLength < n + (r || 0)) throw new RangeError("'length' is out of bounds");
            return e = void 0 === n && void 0 === r ? new Uint8Array(e) : void 0 === r ? new Uint8Array(e, n) : new Uint8Array(e, n, r),
              i.TYPED_ARRAY_SUPPORT ? (t = e, t.__proto__ = i.prototype) : t = f(t, e),
              t
          }
          function d(t, e) {
            if (i.isBuffer(e)) {
              var n = 0 | p(e.length);
              return t = o(t, n),
                0 === t.length ? t : (e.copy(t, 0, 0, n), t)
            }
            if (e) {
              if ("undefined" != typeof ArrayBuffer && e.buffer instanceof ArrayBuffer || "length" in e) return "number" != typeof e.length || J(e.length) ? o(t, 0) : f(t, e);
              if ("Buffer" === e.type && $(e.data)) return f(t, e.data)
            }
            throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.")
          }
          function p(t) {
            if (t >= r()) throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + r().toString(16) + " bytes");
            return 0 | t
          }
          function g(t) {
            return + t != t && (t = 0),
              i.alloc(+ t)
          }
          function y(t, e) {
            if (i.isBuffer(t)) return t.length;
            if ("undefined" != typeof ArrayBuffer && "function" == typeof ArrayBuffer.isView && (ArrayBuffer.isView(t) || t instanceof ArrayBuffer)) return t.byteLength;
            "string" != typeof t && (t = "" + t);
            var n = t.length;
            if (0 === n) return 0;
            for (var r = !1; ;) switch (e) {
              case "ascii":
              case "latin1":
              case "binary":
                return n;
              case "utf8":
              case "utf-8":
              case void 0:
                return z(t).length;
              case "ucs2":
              case "ucs-2":
              case "utf16le":
              case "utf-16le":
                return 2 * n;
              case "hex":
                return n >>> 1;
              case "base64":
                return W(t).length;
              default:
                if (r) return z(t).length;
                e = ("" + e).toLowerCase(),
                  r = !0
            }
          }
          function v(t, e, n) {
            var r = !1;
            if ((void 0 === e || e < 0) && (e = 0), e > this.length) return "";
            if ((void 0 === n || n > this.length) && (n = this.length), n <= 0) return "";
            if (n >>>= 0, e >>>= 0, n <= e) return "";
            for (t || (t = "utf8"); ;) switch (t) {
              case "hex":
                return O(this, e, n);
              case "utf8":
              case "utf-8":
                return k(this, e, n);
              case "ascii":
                return S(this, e, n);
              case "latin1":
              case "binary":
                return P(this, e, n);
              case "base64":
                return T(this, e, n);
              case "ucs2":
              case "ucs-2":
              case "utf16le":
              case "utf-16le":
                return I(this, e, n);
              default:
                if (r) throw new TypeError("Unknown encoding: " + t);
                t = (t + "").toLowerCase(),
                  r = !0
            }
          }
          function C(t, e, n) {
            var r = t[e];
            t[e] = t[n],
              t[n] = r
          }
          function m(t, e, n, r, o) {
            if (0 === t.length) return - 1;
            if ("string" == typeof n ? (r = n, n = 0) : n > 2147483647 ? n = 2147483647 : n < -2147483648 && (n = -2147483648), n = +n, isNaN(n) && (n = o ? 0 : t.length - 1), n < 0 && (n = t.length + n), n >= t.length) {
              if (o) return - 1;
              n = t.length - 1
            } else if (n < 0) {
              if (!o) return - 1;
              n = 0
            }
            if ("string" == typeof e && (e = i.from(e, r)), i.isBuffer(e)) return 0 === e.length ? -1 : A(t, e, n, r, o);
            if ("number" == typeof e) return e &= 255,
              i.TYPED_ARRAY_SUPPORT && "function" == typeof Uint8Array.prototype.indexOf ? o ? Uint8Array.prototype.indexOf.call(t, e, n) : Uint8Array.prototype.lastIndexOf.call(t, e, n) : A(t, [e], n, r, o);
            throw new TypeError("val must be string, number or Buffer")
          }
          function A(t, e, n, r, o) {
            function i(t, e) {
              return 1 === a ? t[e] : t.readUInt16BE(e * a)
            }
            var a = 1,
              s = t.length,
              u = e.length;
            if (void 0 !== r && ("ucs2" === (r = String(r).toLowerCase()) || "ucs-2" === r || "utf16le" === r || "utf-16le" === r)) {
              if (t.length < 2 || e.length < 2) return - 1;
              a = 2,
                s /= 2,
                u /= 2,
                n /= 2
            }
            var c;
            if (o) {
              var l = -1;
              for (c = n; c < s; c++) if (i(t, c) === i(e, -1 === l ? 0 : c - l)) {
                if (- 1 === l && (l = c), c - l + 1 === u) return l * a
              } else - 1 !== l && (c -= c - l),
                l = -1
            } else for (n + u > s && (n = s - u), c = n; c >= 0; c--) {
              for (var f = !0,
                h = 0; h < u; h++) if (i(t, c + h) !== i(e, h)) {
                  f = !1;
                  break
                }
              if (f) return c
            }
            return - 1
          }
          function _(t, e, n, r) {
            n = Number(n) || 0;
            var o = t.length - n;
            r ? (r = Number(r)) > o && (r = o) : r = o;
            var i = e.length;
            if (i % 2 != 0) throw new TypeError("Invalid hex string");
            r > i / 2 && (r = i / 2);
            for (var a = 0; a < r; ++a) {
              var s = parseInt(e.substr(2 * a, 2), 16);
              if (isNaN(s)) return a;
              t[n + a] = s
            }
            return a
          }
          function x(t, e, n, r) {
            return X(z(e, t.length - n), t, n, r)
          }
          function w(t, e, n, r) {
            return X(H(e), t, n, r)
          }
          function R(t, e, n, r) {
            return w(t, e, n, r)
          }
          function B(t, e, n, r) {
            return X(W(e), t, n, r)
          }
          function E(t, e, n, r) {
            return X(q(e, t.length - n), t, n, r)
          }
          function T(t, e, n) {
            return 0 === e && n === t.length ? Z.fromByteArray(t) : Z.fromByteArray(t.slice(e, n))
          }
          function k(t, e, n) {
            n = Math.min(t.length, n);
            for (var r = [], o = e; o < n;) {
              var i = t[o],
                a = null,
                s = i > 239 ? 4 : i > 223 ? 3 : i > 191 ? 2 : 1;
              if (o + s <= n) {
                var u, c, l, f;
                switch (s) {
                  case 1:
                    i < 128 && (a = i);
                    break;
                  case 2:
                    u = t[o + 1],
                      128 == (192 & u) && (f = (31 & i) << 6 | 63 & u) > 127 && (a = f);
                    break;
                  case 3:
                    u = t[o + 1],
                      c = t[o + 2],
                      128 == (192 & u) && 128 == (192 & c) && (f = (15 & i) << 12 | (63 & u) << 6 | 63 & c) > 2047 && (f < 55296 || f > 57343) && (a = f);
                    break;
                  case 4:
                    u = t[o + 1],
                      c = t[o + 2],
                      l = t[o + 3],
                      128 == (192 & u) && 128 == (192 & c) && 128 == (192 & l) && (f = (15 & i) << 18 | (63 & u) << 12 | (63 & c) << 6 | 63 & l) > 65535 && f < 1114112 && (a = f)
                }
              }
              null === a ? (a = 65533, s = 1) : a > 65535 && (a -= 65536, r.push(a >>> 10 & 1023 | 55296), a = 56320 | 1023 & a),
                r.push(a),
                o += s
            }
            return b(r)
          }
          function b(t) {
            var e = t.length;
            if (e <= Q) return String.fromCharCode.apply(String, t);
            for (var n = "",
              r = 0; r < e;) n += String.fromCharCode.apply(String, t.slice(r, r += Q));
            return n
          }
          function S(t, e, n) {
            var r = "";
            n = Math.min(t.length, n);
            for (var o = e; o < n; ++o) r += String.fromCharCode(127 & t[o]);
            return r
          }
          function P(t, e, n) {
            var r = "";
            n = Math.min(t.length, n);
            for (var o = e; o < n; ++o) r += String.fromCharCode(t[o]);
            return r
          }
          function O(t, e, n) {
            var r = t.length; (!e || e < 0) && (e = 0),
              (!n || n < 0 || n > r) && (n = r);
            for (var o = "",
              i = e; i < n; ++i) o += Y(t[i]);
            return o
          }
          function I(t, e, n) {
            for (var r = t.slice(e, n), o = "", i = 0; i < r.length; i += 2) o += String.fromCharCode(r[i] + 256 * r[i + 1]);
            return o
          }
          function D(t, e, n) {
            if (t % 1 != 0 || t < 0) throw new RangeError("offset is not uint");
            if (t + e > n) throw new RangeError("Trying to access beyond buffer length")
          }
          function M(t, e, n, r, o, a) {
            if (!i.isBuffer(t)) throw new TypeError('"buffer" argument must be a Buffer instance');
            if (e > o || e < a) throw new RangeError('"value" argument is out of bounds');
            if (n + r > t.length) throw new RangeError("Index out of range")
          }
          function L(t, e, n, r) {
            e < 0 && (e = 65535 + e + 1);
            for (var o = 0,
              i = Math.min(t.length - n, 2); o < i; ++o) t[n + o] = (e & 255 << 8 * (r ? o : 1 - o)) >>> 8 * (r ? o : 1 - o)
          }
          function U(t, e, n, r) {
            e < 0 && (e = 4294967295 + e + 1);
            for (var o = 0,
              i = Math.min(t.length - n, 4); o < i; ++o) t[n + o] = e >>> 8 * (r ? o : 3 - o) & 255
          }
          function j(t, e, n, r, o, i) {
            if (n + r > t.length) throw new RangeError("Index out of range");
            if (n < 0) throw new RangeError("Index out of range")
          }
          function F(t, e, n, r, o) {
            return o || j(t, e, n, 4, 3.4028234663852886e38, -3.4028234663852886e38),
              V.write(t, e, n, r, 23, 4),
              n + 4
          }
          function N(t, e, n, r, o) {
            return o || j(t, e, n, 8, 1.7976931348623157e308, -1.7976931348623157e308),
              V.write(t, e, n, r, 52, 8),
              n + 8
          }
          function K(t) {
            if (t = G(t).replace(tt, ""), t.length < 2) return "";
            for (; t.length % 4 != 0;) t += "=";
            return t
          }
          function G(t) {
            return t.trim ? t.trim() : t.replace(/^\s+|\s+$/g, "")
          }
          function Y(t) {
            return t < 16 ? "0" + t.toString(16) : t.toString(16)
          }
          function z(t, e) {
            e = e || 1 / 0;
            for (var n, r = t.length,
              o = null,
              i = [], a = 0; a < r; ++a) {
              if ((n = t.charCodeAt(a)) > 55295 && n < 57344) {
                if (!o) {
                  if (n > 56319) {
                  (e -= 3) > -1 && i.push(239, 191, 189);
                    continue
                  }
                  if (a + 1 === r) {
                  (e -= 3) > -1 && i.push(239, 191, 189);
                    continue
                  }
                  o = n;
                  continue
                }
                if (n < 56320) {
                (e -= 3) > -1 && i.push(239, 191, 189),
                  o = n;
                  continue
                }
                n = 65536 + (o - 55296 << 10 | n - 56320)
              } else o && (e -= 3) > -1 && i.push(239, 191, 189);
              if (o = null, n < 128) {
                if ((e -= 1) < 0) break;
                i.push(n)
              } else if (n < 2048) {
                if ((e -= 2) < 0) break;
                i.push(n >> 6 | 192, 63 & n | 128)
              } else if (n < 65536) {
                if ((e -= 3) < 0) break;
                i.push(n >> 12 | 224, n >> 6 & 63 | 128, 63 & n | 128)
              } else {
                if (!(n < 1114112)) throw new Error("Invalid code point");
                if ((e -= 4) < 0) break;
                i.push(n >> 18 | 240, n >> 12 & 63 | 128, n >> 6 & 63 | 128, 63 & n | 128)
              }
            }
            return i
          }
          function H(t) {
            for (var e = [], n = 0; n < t.length; ++n) e.push(255 & t.charCodeAt(n));
            return e
          }
          function q(t, e) {
            for (var n, r, o, i = [], a = 0; a < t.length && !((e -= 2) < 0); ++a) n = t.charCodeAt(a),
              r = n >> 8,
              o = n % 256,
              i.push(o),
              i.push(r);
            return i
          }
          function W(t) {
            return Z.toByteArray(K(t))
          }
          function X(t, e, n, r) {
            for (var o = 0; o < r && !(o + n >= e.length || o >= t.length); ++o) e[o + n] = t[o];
            return o
          }
          function J(t) {
            return t !== t
          }
          /*!
* The buffer module from node.js, for the browser.
*
* @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
* @license  MIT
*/
          var Z = n(5),
            V = n(6),
            $ = n(7);
          e.Buffer = i,
            e.SlowBuffer = g,
            e.INSPECT_MAX_BYTES = 50,
            i.TYPED_ARRAY_SUPPORT = void 0 !== t.TYPED_ARRAY_SUPPORT ? t.TYPED_ARRAY_SUPPORT : function () {
              try {
                var t = new Uint8Array(1);
                return t.__proto__ = {
                  __proto__: Uint8Array.prototype,
                  foo: function () {
                    return 42
                  }
                },
                  42 === t.foo() && "function" == typeof t.subarray && 0 === t.subarray(1, 1).byteLength
              } catch (t) {
                return !1
              }
            }(),
            e.kMaxLength = r(),
            i.poolSize = 8192,
            i._augment = function (t) {
              return t.__proto__ = i.prototype,
                t
            },
            i.from = function (t, e, n) {
              return a(null, t, e, n)
            },
            i.TYPED_ARRAY_SUPPORT && (i.prototype.__proto__ = Uint8Array.prototype, i.__proto__ = Uint8Array, "undefined" != typeof Symbol && Symbol.species && i[Symbol.species] === i && Object.defineProperty(i, Symbol.species, {
              value: null,
              configurable: !0
            })),
            i.alloc = function (t, e, n) {
              return u(null, t, e, n)
            },
            i.allocUnsafe = function (t) {
              return c(null, t)
            },
            i.allocUnsafeSlow = function (t) {
              return c(null, t)
            },
            i.isBuffer = function (t) {
              return !(null == t || !t._isBuffer)
            },
            i.compare = function (t, e) {
              if (!i.isBuffer(t) || !i.isBuffer(e)) throw new TypeError("Arguments must be Buffers");
              if (t === e) return 0;
              for (var n = t.length,
                r = e.length,
                o = 0,
                a = Math.min(n, r); o < a; ++o) if (t[o] !== e[o]) {
                  n = t[o],
                    r = e[o];
                  break
                }
              return n < r ? -1 : r < n ? 1 : 0
            },
            i.isEncoding = function (t) {
              switch (String(t).toLowerCase()) {
                case "hex":
                case "utf8":
                case "utf-8":
                case "ascii":
                case "latin1":
                case "binary":
                case "base64":
                case "ucs2":
                case "ucs-2":
                case "utf16le":
                case "utf-16le":
                  return !0;
                default:
                  return !1
              }
            },
            i.concat = function (t, e) {
              if (!$(t)) throw new TypeError('"list" argument must be an Array of Buffers');
              if (0 === t.length) return i.alloc(0);
              var n;
              if (void 0 === e) for (e = 0, n = 0; n < t.length; ++n) e += t[n].length;
              var r = i.allocUnsafe(e),
                o = 0;
              for (n = 0; n < t.length; ++n) {
                var a = t[n];
                if (!i.isBuffer(a)) throw new TypeError('"list" argument must be an Array of Buffers');
                a.copy(r, o),
                  o += a.length
              }
              return r
            },
            i.byteLength = y,
            i.prototype._isBuffer = !0,
            i.prototype.swap16 = function () {
              var t = this.length;
              if (t % 2 != 0) throw new RangeError("Buffer size must be a multiple of 16-bits");
              for (var e = 0; e < t; e += 2) C(this, e, e + 1);
              return this
            },
            i.prototype.swap32 = function () {
              var t = this.length;
              if (t % 4 != 0) throw new RangeError("Buffer size must be a multiple of 32-bits");
              for (var e = 0; e < t; e += 4) C(this, e, e + 3),
                C(this, e + 1, e + 2);
              return this
            },
            i.prototype.swap64 = function () {
              var t = this.length;
              if (t % 8 != 0) throw new RangeError("Buffer size must be a multiple of 64-bits");
              for (var e = 0; e < t; e += 8) C(this, e, e + 7),
                C(this, e + 1, e + 6),
                C(this, e + 2, e + 5),
                C(this, e + 3, e + 4);
              return this
            },
            i.prototype.toString = function () {
              var t = 0 | this.length;
              return 0 === t ? "" : 0 === arguments.length ? k(this, 0, t) : v.apply(this, arguments)
            },
            i.prototype.equals = function (t) {
              if (!i.isBuffer(t)) throw new TypeError("Argument must be a Buffer");
              return this === t || 0 === i.compare(this, t)
            },
            i.prototype.inspect = function () {
              var t = "",
                n = e.INSPECT_MAX_BYTES;
              return this.length > 0 && (t = this.toString("hex", 0, n).match(/.{2}/g).join(" "), this.length > n && (t += " ... ")),
                "<Buffer " + t + ">"
            },
            i.prototype.compare = function (t, e, n, r, o) {
              if (!i.isBuffer(t)) throw new TypeError("Argument must be a Buffer");
              if (void 0 === e && (e = 0), void 0 === n && (n = t ? t.length : 0), void 0 === r && (r = 0), void 0 === o && (o = this.length), e < 0 || n > t.length || r < 0 || o > this.length) throw new RangeError("out of range index");
              if (r >= o && e >= n) return 0;
              if (r >= o) return - 1;
              if (e >= n) return 1;
              if (e >>>= 0, n >>>= 0, r >>>= 0, o >>>= 0, this === t) return 0;
              for (var a = o - r,
                s = n - e,
                u = Math.min(a, s), c = this.slice(r, o), l = t.slice(e, n), f = 0; f < u; ++f) if (c[f] !== l[f]) {
                  a = c[f],
                    s = l[f];
                  break
                }
              return a < s ? -1 : s < a ? 1 : 0
            },
            i.prototype.includes = function (t, e, n) {
              return - 1 !== this.indexOf(t, e, n)
            },
            i.prototype.indexOf = function (t, e, n) {
              return m(this, t, e, n, !0)
            },
            i.prototype.lastIndexOf = function (t, e, n) {
              return m(this, t, e, n, !1)
            },
            i.prototype.write = function (t, e, n, r) {
              if (void 0 === e) r = "utf8",
                n = this.length,
                e = 0;
              else if (void 0 === n && "string" == typeof e) r = e,
                n = this.length,
                e = 0;
              else {
                if (!isFinite(e)) throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
                e |= 0,
                  isFinite(n) ? (n |= 0, void 0 === r && (r = "utf8")) : (r = n, n = void 0)
              }
              var o = this.length - e;
              if ((void 0 === n || n > o) && (n = o), t.length > 0 && (n < 0 || e < 0) || e > this.length) throw new RangeError("Attempt to write outside buffer bounds");
              r || (r = "utf8");
              for (var i = !1; ;) switch (r) {
                case "hex":
                  return _(this, t, e, n);
                case "utf8":
                case "utf-8":
                  return x(this, t, e, n);
                case "ascii":
                  return w(this, t, e, n);
                case "latin1":
                case "binary":
                  return R(this, t, e, n);
                case "base64":
                  return B(this, t, e, n);
                case "ucs2":
                case "ucs-2":
                case "utf16le":
                case "utf-16le":
                  return E(this, t, e, n);
                default:
                  if (i) throw new TypeError("Unknown encoding: " + r);
                  r = ("" + r).toLowerCase(),
                    i = !0
              }
            },
            i.prototype.toJSON = function () {
              return {
                type: "Buffer",
                data: Array.prototype.slice.call(this._arr || this, 0)
              }
            };
          var Q = 4096;
          i.prototype.slice = function (t, e) {
            var n = this.length;
            t = ~~t,
              e = void 0 === e ? n : ~~e,
              t < 0 ? (t += n) < 0 && (t = 0) : t > n && (t = n),
              e < 0 ? (e += n) < 0 && (e = 0) : e > n && (e = n),
              e < t && (e = t);
            var r;
            if (i.TYPED_ARRAY_SUPPORT) r = this.subarray(t, e),
              r.__proto__ = i.prototype;
            else {
              var o = e - t;
              r = new i(o, void 0);
              for (var a = 0; a < o; ++a) r[a] = this[a + t]
            }
            return r
          },
            i.prototype.readUIntLE = function (t, e, n) {
              t |= 0,
                e |= 0,
                n || D(t, e, this.length);
              for (var r = this[t], o = 1, i = 0; ++i < e && (o *= 256);) r += this[t + i] * o;
              return r
            },
            i.prototype.readUIntBE = function (t, e, n) {
              t |= 0,
                e |= 0,
                n || D(t, e, this.length);
              for (var r = this[t + --e], o = 1; e > 0 && (o *= 256);) r += this[t + --e] * o;
              return r
            },
            i.prototype.readUInt8 = function (t, e) {
              return e || D(t, 1, this.length),
                this[t]
            },
            i.prototype.readUInt16LE = function (t, e) {
              return e || D(t, 2, this.length),
                this[t] | this[t + 1] << 8
            },
            i.prototype.readUInt16BE = function (t, e) {
              return e || D(t, 2, this.length),
                this[t] << 8 | this[t + 1]
            },
            i.prototype.readUInt32LE = function (t, e) {
              return e || D(t, 4, this.length),
                (this[t] | this[t + 1] << 8 | this[t + 2] << 16) + 16777216 * this[t + 3]
            },
            i.prototype.readUInt32BE = function (t, e) {
              return e || D(t, 4, this.length),
                16777216 * this[t] + (this[t + 1] << 16 | this[t + 2] << 8 | this[t + 3])
            },
            i.prototype.readIntLE = function (t, e, n) {
              t |= 0,
                e |= 0,
                n || D(t, e, this.length);
              for (var r = this[t], o = 1, i = 0; ++i < e && (o *= 256);) r += this[t + i] * o;
              return o *= 128,
                r >= o && (r -= Math.pow(2, 8 * e)),
                r
            },
            i.prototype.readIntBE = function (t, e, n) {
              t |= 0,
                e |= 0,
                n || D(t, e, this.length);
              for (var r = e,
                o = 1,
                i = this[t + --r]; r > 0 && (o *= 256);) i += this[t + --r] * o;
              return o *= 128,
                i >= o && (i -= Math.pow(2, 8 * e)),
                i
            },
            i.prototype.readInt8 = function (t, e) {
              return e || D(t, 1, this.length),
                128 & this[t] ? -1 * (255 - this[t] + 1) : this[t]
            },
            i.prototype.readInt16LE = function (t, e) {
              e || D(t, 2, this.length);
              var n = this[t] | this[t + 1] << 8;
              return 32768 & n ? 4294901760 | n : n
            },
            i.prototype.readInt16BE = function (t, e) {
              e || D(t, 2, this.length);
              var n = this[t + 1] | this[t] << 8;
              return 32768 & n ? 4294901760 | n : n
            },
            i.prototype.readInt32LE = function (t, e) {
              return e || D(t, 4, this.length),
                this[t] | this[t + 1] << 8 | this[t + 2] << 16 | this[t + 3] << 24
            },
            i.prototype.readInt32BE = function (t, e) {
              return e || D(t, 4, this.length),
                this[t] << 24 | this[t + 1] << 16 | this[t + 2] << 8 | this[t + 3]
            },
            i.prototype.readFloatLE = function (t, e) {
              return e || D(t, 4, this.length),
                V.read(this, t, !0, 23, 4)
            },
            i.prototype.readFloatBE = function (t, e) {
              return e || D(t, 4, this.length),
                V.read(this, t, !1, 23, 4)
            },
            i.prototype.readDoubleLE = function (t, e) {
              return e || D(t, 8, this.length),
                V.read(this, t, !0, 52, 8)
            },
            i.prototype.readDoubleBE = function (t, e) {
              return e || D(t, 8, this.length),
                V.read(this, t, !1, 52, 8)
            },
            i.prototype.writeUIntLE = function (t, e, n, r) {
              if (t = +t, e |= 0, n |= 0, !r) {
                M(this, t, e, n, Math.pow(2, 8 * n) - 1, 0)
              }
              var o = 1,
                i = 0;
              for (this[e] = 255 & t; ++i < n && (o *= 256);) this[e + i] = t / o & 255;
              return e + n
            },
            i.prototype.writeUIntBE = function (t, e, n, r) {
              if (t = +t, e |= 0, n |= 0, !r) {
                M(this, t, e, n, Math.pow(2, 8 * n) - 1, 0)
              }
              var o = n - 1,
                i = 1;
              for (this[e + o] = 255 & t; --o >= 0 && (i *= 256);) this[e + o] = t / i & 255;
              return e + n
            },
            i.prototype.writeUInt8 = function (t, e, n) {
              return t = +t,
                e |= 0,
                n || M(this, t, e, 1, 255, 0),
                i.TYPED_ARRAY_SUPPORT || (t = Math.floor(t)),
                this[e] = 255 & t,
                e + 1
            },
            i.prototype.writeUInt16LE = function (t, e, n) {
              return t = +t,
                e |= 0,
                n || M(this, t, e, 2, 65535, 0),
                i.TYPED_ARRAY_SUPPORT ? (this[e] = 255 & t, this[e + 1] = t >>> 8) : L(this, t, e, !0),
                e + 2
            },
            i.prototype.writeUInt16BE = function (t, e, n) {
              return t = +t,
                e |= 0,
                n || M(this, t, e, 2, 65535, 0),
                i.TYPED_ARRAY_SUPPORT ? (this[e] = t >>> 8, this[e + 1] = 255 & t) : L(this, t, e, !1),
                e + 2
            },
            i.prototype.writeUInt32LE = function (t, e, n) {
              return t = +t,
                e |= 0,
                n || M(this, t, e, 4, 4294967295, 0),
                i.TYPED_ARRAY_SUPPORT ? (this[e + 3] = t >>> 24, this[e + 2] = t >>> 16, this[e + 1] = t >>> 8, this[e] = 255 & t) : U(this, t, e, !0),
                e + 4
            },
            i.prototype.writeUInt32BE = function (t, e, n) {
              return t = +t,
                e |= 0,
                n || M(this, t, e, 4, 4294967295, 0),
                i.TYPED_ARRAY_SUPPORT ? (this[e] = t >>> 24, this[e + 1] = t >>> 16, this[e + 2] = t >>> 8, this[e + 3] = 255 & t) : U(this, t, e, !1),
                e + 4
            },
            i.prototype.writeIntLE = function (t, e, n, r) {
              if (t = +t, e |= 0, !r) {
                var o = Math.pow(2, 8 * n - 1);
                M(this, t, e, n, o - 1, -o)
              }
              var i = 0,
                a = 1,
                s = 0;
              for (this[e] = 255 & t; ++i < n && (a *= 256);) t < 0 && 0 === s && 0 !== this[e + i - 1] && (s = 1),
                this[e + i] = (t / a >> 0) - s & 255;
              return e + n
            },
            i.prototype.writeIntBE = function (t, e, n, r) {
              if (t = +t, e |= 0, !r) {
                var o = Math.pow(2, 8 * n - 1);
                M(this, t, e, n, o - 1, -o)
              }
              var i = n - 1,
                a = 1,
                s = 0;
              for (this[e + i] = 255 & t; --i >= 0 && (a *= 256);) t < 0 && 0 === s && 0 !== this[e + i + 1] && (s = 1),
                this[e + i] = (t / a >> 0) - s & 255;
              return e + n
            },
            i.prototype.writeInt8 = function (t, e, n) {
              return t = +t,
                e |= 0,
                n || M(this, t, e, 1, 127, -128),
                i.TYPED_ARRAY_SUPPORT || (t = Math.floor(t)),
                t < 0 && (t = 255 + t + 1),
                this[e] = 255 & t,
                e + 1
            },
            i.prototype.writeInt16LE = function (t, e, n) {
              return t = +t,
                e |= 0,
                n || M(this, t, e, 2, 32767, -32768),
                i.TYPED_ARRAY_SUPPORT ? (this[e] = 255 & t, this[e + 1] = t >>> 8) : L(this, t, e, !0),
                e + 2
            },
            i.prototype.writeInt16BE = function (t, e, n) {
              return t = +t,
                e |= 0,
                n || M(this, t, e, 2, 32767, -32768),
                i.TYPED_ARRAY_SUPPORT ? (this[e] = t >>> 8, this[e + 1] = 255 & t) : L(this, t, e, !1),
                e + 2
            },
            i.prototype.writeInt32LE = function (t, e, n) {
              return t = +t,
                e |= 0,
                n || M(this, t, e, 4, 2147483647, -2147483648),
                i.TYPED_ARRAY_SUPPORT ? (this[e] = 255 & t, this[e + 1] = t >>> 8, this[e + 2] = t >>> 16, this[e + 3] = t >>> 24) : U(this, t, e, !0),
                e + 4
            },
            i.prototype.writeInt32BE = function (t, e, n) {
              return t = +t,
                e |= 0,
                n || M(this, t, e, 4, 2147483647, -2147483648),
                t < 0 && (t = 4294967295 + t + 1),
                i.TYPED_ARRAY_SUPPORT ? (this[e] = t >>> 24, this[e + 1] = t >>> 16, this[e + 2] = t >>> 8, this[e + 3] = 255 & t) : U(this, t, e, !1),
                e + 4
            },
            i.prototype.writeFloatLE = function (t, e, n) {
              return F(this, t, e, !0, n)
            },
            i.prototype.writeFloatBE = function (t, e, n) {
              return F(this, t, e, !1, n)
            },
            i.prototype.writeDoubleLE = function (t, e, n) {
              return N(this, t, e, !0, n)
            },
            i.prototype.writeDoubleBE = function (t, e, n) {
              return N(this, t, e, !1, n)
            },
            i.prototype.copy = function (t, e, n, r) {
              if (n || (n = 0), r || 0 === r || (r = this.length), e >= t.length && (e = t.length), e || (e = 0), r > 0 && r < n && (r = n), r === n) return 0;
              if (0 === t.length || 0 === this.length) return 0;
              if (e < 0) throw new RangeError("targetStart out of bounds");
              if (n < 0 || n >= this.length) throw new RangeError("sourceStart out of bounds");
              if (r < 0) throw new RangeError("sourceEnd out of bounds");
              r > this.length && (r = this.length),
                t.length - e < r - n && (r = t.length - e + n);
              var o, a = r - n;
              if (this === t && n < e && e < r) for (o = a - 1; o >= 0; --o) t[o + e] = this[o + n];
              else if (a < 1e3 || !i.TYPED_ARRAY_SUPPORT) for (o = 0; o < a; ++o) t[o + e] = this[o + n];
              else Uint8Array.prototype.set.call(t, this.subarray(n, n + a), e);
              return a
            },
            i.prototype.fill = function (t, e, n, r) {
              if ("string" == typeof t) {
                if ("string" == typeof e ? (r = e, e = 0, n = this.length) : "string" == typeof n && (r = n, n = this.length), 1 === t.length) {
                  var o = t.charCodeAt(0);
                  o < 256 && (t = o)
                }
                if (void 0 !== r && "string" != typeof r) throw new TypeError("encoding must be a string");
                if ("string" == typeof r && !i.isEncoding(r)) throw new TypeError("Unknown encoding: " + r)
              } else "number" == typeof t && (t &= 255);
              if (e < 0 || this.length < e || this.length < n) throw new RangeError("Out of range index");
              if (n <= e) return this;
              e >>>= 0,
                n = void 0 === n ? this.length : n >>> 0,
                t || (t = 0);
              var a;
              if ("number" == typeof t) for (a = e; a < n; ++a) this[a] = t;
              else {
                var s = i.isBuffer(t) ? t : z(new i(t, r).toString()),
                  u = s.length;
                for (a = 0; a < n - e; ++a) this[a + e] = s[a % u]
              }
              return this
            };
          var tt = /[^+\/0-9A-Za-z-_]/g
        }).call(e, n(4))
      },
      function (t, e, n) {
        var r = n(3);
        t.exports = r
      },
      function (t, e, n) {
        "use strict";
        var r = n(0),
          o = n(12),
          i = n(13),
          a = n(14),
          s = {
            SecretId: "",
            SecretKey: "",
            FileParallelLimit: 3,
            ChunkParallelLimit: 3,
            ChunkSize: 1048576,
            ProgressInterval: 1e3,
            Domain: "",
            ServiceDomain: ""
          },
          u = function (t) {
            this.options = r.extend(r.clone(s), t || {}),
              o.init(this),
              i.init(this)
          };
        r.extend(u.prototype, a),
          u.getAuthorization = r.getAuth,
          u.version = "0.4.0",
          t.exports = u
      },
      function (t, e) {
        var n;
        n = function () {
          return this
        }();
        try {
          n = n || Function("return this")() || (0, eval)("this")
        } catch (t) {
          "object" == typeof window && (n = window)
        }
        t.exports = n
      },
      function (t, e, n) {
        "use strict";
        function r(t) {
          var e = t.length;
          if (e % 4 > 0) throw new Error("Invalid string. Length must be a multiple of 4");
          return "=" === t[e - 2] ? 2 : "=" === t[e - 1] ? 1 : 0
        }
        function o(t) {
          return 3 * t.length / 4 - r(t)
        }
        function i(t) {
          var e, n, o, i, a, s = t.length;
          i = r(t),
            a = new f(3 * s / 4 - i),
            n = i > 0 ? s - 4 : s;
          var u = 0;
          for (e = 0; e < n; e += 4) o = l[t.charCodeAt(e)] << 18 | l[t.charCodeAt(e + 1)] << 12 | l[t.charCodeAt(e + 2)] << 6 | l[t.charCodeAt(e + 3)],
            a[u++] = o >> 16 & 255,
            a[u++] = o >> 8 & 255,
            a[u++] = 255 & o;
          return 2 === i ? (o = l[t.charCodeAt(e)] << 2 | l[t.charCodeAt(e + 1)] >> 4, a[u++] = 255 & o) : 1 === i && (o = l[t.charCodeAt(e)] << 10 | l[t.charCodeAt(e + 1)] << 4 | l[t.charCodeAt(e + 2)] >> 2, a[u++] = o >> 8 & 255, a[u++] = 255 & o),
            a
        }
        function a(t) {
          return c[t >> 18 & 63] + c[t >> 12 & 63] + c[t >> 6 & 63] + c[63 & t]
        }
        function s(t, e, n) {
          for (var r, o = [], i = e; i < n; i += 3) r = (t[i] << 16) + (t[i + 1] << 8) + t[i + 2],
            o.push(a(r));
          return o.join("")
        }
        function u(t) {
          for (var e, n = t.length,
            r = n % 3,
            o = "",
            i = [], a = 0, u = n - r; a < u; a += 16383) i.push(s(t, a, a + 16383 > u ? u : a + 16383));
          return 1 === r ? (e = t[n - 1], o += c[e >> 2], o += c[e << 4 & 63], o += "==") : 2 === r && (e = (t[n - 2] << 8) + t[n - 1], o += c[e >> 10], o += c[e >> 4 & 63], o += c[e << 2 & 63], o += "="),
            i.push(o),
            i.join("")
        }
        e.byteLength = o,
          e.toByteArray = i,
          e.fromByteArray = u;
        for (var c = [], l = [], f = "undefined" != typeof Uint8Array ? Uint8Array : Array, h = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", d = 0, p = h.length; d < p; ++d) c[d] = h[d],
          l[h.charCodeAt(d)] = d;
        l["-".charCodeAt(0)] = 62,
          l["_".charCodeAt(0)] = 63
      },
      function (t, e) {
        e.read = function (t, e, n, r, o) {
          var i, a, s = 8 * o - r - 1,
            u = (1 << s) - 1,
            c = u >> 1,
            l = -7,
            f = n ? o - 1 : 0,
            h = n ? -1 : 1,
            d = t[e + f];
          for (f += h, i = d & (1 << -l) - 1, d >>= -l, l += s; l > 0; i = 256 * i + t[e + f], f += h, l -= 8);
          for (a = i & (1 << -l) - 1, i >>= -l, l += r; l > 0; a = 256 * a + t[e + f], f += h, l -= 8);
          if (0 === i) i = 1 - c;
          else {
            if (i === u) return a ? NaN : 1 / 0 * (d ? -1 : 1);
            a += Math.pow(2, r),
              i -= c
          }
          return (d ? -1 : 1) * a * Math.pow(2, i - r)
        },
          e.write = function (t, e, n, r, o, i) {
            var a, s, u, c = 8 * i - o - 1,
              l = (1 << c) - 1,
              f = l >> 1,
              h = 23 === o ? Math.pow(2, -24) - Math.pow(2, -77) : 0,
              d = r ? 0 : i - 1,
              p = r ? 1 : -1,
              g = e < 0 || 0 === e && 1 / e < 0 ? 1 : 0;
            for (e = Math.abs(e), isNaN(e) || e === 1 / 0 ? (s = isNaN(e) ? 1 : 0, a = l) : (a = Math.floor(Math.log(e) / Math.LN2), e * (u = Math.pow(2, -a)) < 1 && (a-- , u *= 2), e += a + f >= 1 ? h / u : h * Math.pow(2, 1 - f), e * u >= 2 && (a++ , u /= 2), a + f >= l ? (s = 0, a = l) : a + f >= 1 ? (s = (e * u - 1) * Math.pow(2, o), a += f) : (s = e * Math.pow(2, f - 1) * Math.pow(2, o), a = 0)); o >= 8; t[n + d] = 255 & s, d += p, s /= 256, o -= 8);
            for (a = a << o | s, c += o; c > 0; t[n + d] = 255 & a, d += p, a /= 256, c -= 8);
            t[n + d - p] |= 128 * g
          }
      },
      function (t, e) {
        var n = {}.toString;
        t.exports = Array.isArray ||
          function (t) {
            return "[object Array]" == n.call(t)
          }
      },
      function (t, e) {
        var n = function (t) {
          function e(t, e) {
            return t << e | t >>> 32 - e
          }
          function n(t, e) {
            var n, r, o, i, a;
            return o = 2147483648 & t,
              i = 2147483648 & e,
              n = 1073741824 & t,
              r = 1073741824 & e,
              a = (1073741823 & t) + (1073741823 & e),
              n & r ? 2147483648 ^ a ^ o ^ i : n | r ? 1073741824 & a ? 3221225472 ^ a ^ o ^ i : 1073741824 ^ a ^ o ^ i : a ^ o ^ i
          }
          function r(t, e, n) {
            return t & e | ~t & n
          }
          function o(t, e, n) {
            return t & n | e & ~n
          }
          function i(t, e, n) {
            return t ^ e ^ n
          }
          function a(t, e, n) {
            return e ^ (t | ~n)
          }
          function s(t, o, i, a, s, u, c) {
            return t = n(t, n(n(r(o, i, a), s), c)),
              n(e(t, u), o)
          }
          function u(t, r, i, a, s, u, c) {
            return t = n(t, n(n(o(r, i, a), s), c)),
              n(e(t, u), r)
          }
          function c(t, r, o, a, s, u, c) {
            return t = n(t, n(n(i(r, o, a), s), c)),
              n(e(t, u), r)
          }
          function l(t, r, o, i, s, u, c) {
            return t = n(t, n(n(a(r, o, i), s), c)),
              n(e(t, u), r)
          }
          function f(t) {
            var e, n, r = "",
              o = "";
            for (n = 0; n <= 3; n++) e = t >>> 8 * n & 255,
              o = "0" + e.toString(16),
              r += o.substr(o.length - 2, 2);
            return r
          }
          var h, d, p, g, y, v, C, m, A, _ = Array();
          for (t = function (t) {
            t = t.replace(/\r\n/g, "\n");
            for (var e = "",
              n = 0; n < t.length; n++) {
              var r = t.charCodeAt(n);
              r < 128 ? e += String.fromCharCode(r) : r > 127 && r < 2048 ? (e += String.fromCharCode(r >> 6 | 192), e += String.fromCharCode(63 & r | 128)) : (e += String.fromCharCode(r >> 12 | 224), e += String.fromCharCode(r >> 6 & 63 | 128), e += String.fromCharCode(63 & r | 128))
            }
            return e
          }(t), _ = function (t) {
            for (var e, n = t.length,
              r = n + 8,
              o = (r - r % 64) / 64, i = 16 * (o + 1), a = Array(i - 1), s = 0, u = 0; u < n;) e = (u - u % 4) / 4,
                s = u % 4 * 8,
                a[e] = a[e] | t.charCodeAt(u) << s,
                u++;
            return e = (u - u % 4) / 4,
              s = u % 4 * 8,
              a[e] = a[e] | 128 << s,
              a[i - 2] = n << 3,
              a[i - 1] = n >>> 29,
              a
          }(t), v = 1732584193, C = 4023233417, m = 2562383102, A = 271733878, h = 0; h < _.length; h += 16) d = v,
            p = C,
            g = m,
            y = A,
            v = s(v, C, m, A, _[h + 0], 7, 3614090360),
            A = s(A, v, C, m, _[h + 1], 12, 3905402710),
            m = s(m, A, v, C, _[h + 2], 17, 606105819),
            C = s(C, m, A, v, _[h + 3], 22, 3250441966),
            v = s(v, C, m, A, _[h + 4], 7, 4118548399),
            A = s(A, v, C, m, _[h + 5], 12, 1200080426),
            m = s(m, A, v, C, _[h + 6], 17, 2821735955),
            C = s(C, m, A, v, _[h + 7], 22, 4249261313),
            v = s(v, C, m, A, _[h + 8], 7, 1770035416),
            A = s(A, v, C, m, _[h + 9], 12, 2336552879),
            m = s(m, A, v, C, _[h + 10], 17, 4294925233),
            C = s(C, m, A, v, _[h + 11], 22, 2304563134),
            v = s(v, C, m, A, _[h + 12], 7, 1804603682),
            A = s(A, v, C, m, _[h + 13], 12, 4254626195),
            m = s(m, A, v, C, _[h + 14], 17, 2792965006),
            C = s(C, m, A, v, _[h + 15], 22, 1236535329),
            v = u(v, C, m, A, _[h + 1], 5, 4129170786),
            A = u(A, v, C, m, _[h + 6], 9, 3225465664),
            m = u(m, A, v, C, _[h + 11], 14, 643717713),
            C = u(C, m, A, v, _[h + 0], 20, 3921069994),
            v = u(v, C, m, A, _[h + 5], 5, 3593408605),
            A = u(A, v, C, m, _[h + 10], 9, 38016083),
            m = u(m, A, v, C, _[h + 15], 14, 3634488961),
            C = u(C, m, A, v, _[h + 4], 20, 3889429448),
            v = u(v, C, m, A, _[h + 9], 5, 568446438),
            A = u(A, v, C, m, _[h + 14], 9, 3275163606),
            m = u(m, A, v, C, _[h + 3], 14, 4107603335),
            C = u(C, m, A, v, _[h + 8], 20, 1163531501),
            v = u(v, C, m, A, _[h + 13], 5, 2850285829),
            A = u(A, v, C, m, _[h + 2], 9, 4243563512),
            m = u(m, A, v, C, _[h + 7], 14, 1735328473),
            C = u(C, m, A, v, _[h + 12], 20, 2368359562),
            v = c(v, C, m, A, _[h + 5], 4, 4294588738),
            A = c(A, v, C, m, _[h + 8], 11, 2272392833),
            m = c(m, A, v, C, _[h + 11], 16, 1839030562),
            C = c(C, m, A, v, _[h + 14], 23, 4259657740),
            v = c(v, C, m, A, _[h + 1], 4, 2763975236),
            A = c(A, v, C, m, _[h + 4], 11, 1272893353),
            m = c(m, A, v, C, _[h + 7], 16, 4139469664),
            C = c(C, m, A, v, _[h + 10], 23, 3200236656),
            v = c(v, C, m, A, _[h + 13], 4, 681279174),
            A = c(A, v, C, m, _[h + 0], 11, 3936430074),
            m = c(m, A, v, C, _[h + 3], 16, 3572445317),
            C = c(C, m, A, v, _[h + 6], 23, 76029189),
            v = c(v, C, m, A, _[h + 9], 4, 3654602809),
            A = c(A, v, C, m, _[h + 12], 11, 3873151461),
            m = c(m, A, v, C, _[h + 15], 16, 530742520),
            C = c(C, m, A, v, _[h + 2], 23, 3299628645),
            v = l(v, C, m, A, _[h + 0], 6, 4096336452),
            A = l(A, v, C, m, _[h + 7], 10, 1126891415),
            m = l(m, A, v, C, _[h + 14], 15, 2878612391),
            C = l(C, m, A, v, _[h + 5], 21, 4237533241),
            v = l(v, C, m, A, _[h + 12], 6, 1700485571),
            A = l(A, v, C, m, _[h + 3], 10, 2399980690),
            m = l(m, A, v, C, _[h + 10], 15, 4293915773),
            C = l(C, m, A, v, _[h + 1], 21, 2240044497),
            v = l(v, C, m, A, _[h + 8], 6, 1873313359),
            A = l(A, v, C, m, _[h + 15], 10, 4264355552),
            m = l(m, A, v, C, _[h + 6], 15, 2734768916),
            C = l(C, m, A, v, _[h + 13], 21, 1309151649),
            v = l(v, C, m, A, _[h + 4], 6, 4149444226),
            A = l(A, v, C, m, _[h + 11], 10, 3174756917),
            m = l(m, A, v, C, _[h + 2], 15, 718787259),
            C = l(C, m, A, v, _[h + 9], 21, 3951481745),
            v = n(v, d),
            C = n(C, p),
            m = n(m, g),
            A = n(A, y);
          return (f(v) + f(C) + f(m) + f(A)).toLowerCase()
        };
        t.exports = n
      },
      function (t, e) {
        var n = n ||
          function (t, e) {
            var n = {},
              r = n.lib = {},
              o = function () { },
              i = r.Base = {
                extend: function (t) {
                  o.prototype = this;
                  var e = new o;
                  return t && e.mixIn(t),
                    e.hasOwnProperty("init") || (e.init = function () {
                      e.$super.init.apply(this, arguments)
                    }),
                    e.init.prototype = e,
                    e.$super = this,
                    e
                },
                create: function () {
                  var t = this.extend();
                  return t.init.apply(t, arguments),
                    t
                },
                init: function () { },
                mixIn: function (t) {
                  for (var e in t) t.hasOwnProperty(e) && (this[e] = t[e]);
                  t.hasOwnProperty("toString") && (this.toString = t.toString)
                },
                clone: function () {
                  return this.init.prototype.extend(this)
                }
              },
              a = r.WordArray = i.extend({
                init: function (t, e) {
                  t = this.words = t || [],
                    this.sigBytes = void 0 != e ? e : 4 * t.length
                },
                toString: function (t) {
                  return (t || u).stringify(this)
                },
                concat: function (t) {
                  var e = this.words,
                    n = t.words,
                    r = this.sigBytes;
                  if (t = t.sigBytes, this.clamp(), r % 4) for (var o = 0; o < t; o++) e[r + o >>> 2] |= (n[o >>> 2] >>> 24 - o % 4 * 8 & 255) << 24 - (r + o) % 4 * 8;
                  else if (65535 < n.length) for (o = 0; o < t; o += 4) e[r + o >>> 2] = n[o >>> 2];
                  else e.push.apply(e, n);
                  return this.sigBytes += t,
                    this
                },
                clamp: function () {
                  var e = this.words,
                    n = this.sigBytes;
                  e[n >>> 2] &= 4294967295 << 32 - n % 4 * 8,
                    e.length = t.ceil(n / 4)
                },
                clone: function () {
                  var t = i.clone.call(this);
                  return t.words = this.words.slice(0),
                    t
                },
                random: function (e) {
                  for (var n = [], r = 0; r < e; r += 4) n.push(4294967296 * t.random() | 0);
                  return new a.init(n, e)
                }
              }),
              s = n.enc = {},
              u = s.Hex = {
                stringify: function (t) {
                  var e = t.words;
                  t = t.sigBytes;
                  for (var n = [], r = 0; r < t; r++) {
                    var o = e[r >>> 2] >>> 24 - r % 4 * 8 & 255;
                    n.push((o >>> 4).toString(16)),
                      n.push((15 & o).toString(16))
                  }
                  return n.join("")
                },
                parse: function (t) {
                  for (var e = t.length,
                    n = [], r = 0; r < e; r += 2) n[r >>> 3] |= parseInt(t.substr(r, 2), 16) << 24 - r % 8 * 4;
                  return new a.init(n, e / 2)
                }
              },
              c = s.Latin1 = {
                stringify: function (t) {
                  var e = t.words;
                  t = t.sigBytes;
                  for (var n = [], r = 0; r < t; r++) n.push(String.fromCharCode(e[r >>> 2] >>> 24 - r % 4 * 8 & 255));
                  return n.join("")
                },
                parse: function (t) {
                  for (var e = t.length,
                    n = [], r = 0; r < e; r++) n[r >>> 2] |= (255 & t.charCodeAt(r)) << 24 - r % 4 * 8;
                  return new a.init(n, e)
                }
              },
              l = s.Utf8 = {
                stringify: function (t) {
                  try {
                    return decodeURIComponent(escape(c.stringify(t)))
                  } catch (t) {
                    throw Error("Malformed UTF-8 data")
                  }
                },
                parse: function (t) {
                  return c.parse(unescape(encodeURIComponent(t)))
                }
              },
              f = r.BufferedBlockAlgorithm = i.extend({
                reset: function () {
                  this._data = new a.init,
                    this._nDataBytes = 0
                },
                _append: function (t) {
                  "string" == typeof t && (t = l.parse(t)),
                    this._data.concat(t),
                    this._nDataBytes += t.sigBytes
                },
                _process: function (e) {
                  var n = this._data,
                    r = n.words,
                    o = n.sigBytes,
                    i = this.blockSize,
                    s = o / (4 * i),
                    s = e ? t.ceil(s) : t.max((0 | s) - this._minBufferSize, 0);
                  if (e = s * i, o = t.min(4 * e, o), e) {
                    for (var u = 0; u < e; u += i) this._doProcessBlock(r, u);
                    u = r.splice(0, e),
                      n.sigBytes -= o
                  }
                  return new a.init(u, o)
                },
                clone: function () {
                  var t = i.clone.call(this);
                  return t._data = this._data.clone(),
                    t
                },
                _minBufferSize: 0
              });
            r.Hasher = f.extend({
              cfg: i.extend(),
              init: function (t) {
                this.cfg = this.cfg.extend(t),
                  this.reset()
              },
              reset: function () {
                f.reset.call(this),
                  this._doReset()
              },
              update: function (t) {
                return this._append(t),
                  this._process(),
                  this
              },
              finalize: function (t) {
                return t && this._append(t),
                  this._doFinalize()
              },
              blockSize: 16,
              _createHelper: function (t) {
                return function (e, n) {
                  return new t.init(n).finalize(e)
                }
              },
              _createHmacHelper: function (t) {
                return function (e, n) {
                  return new h.HMAC.init(t, n).finalize(e)
                }
              }
            });
            var h = n.algo = {};
            return n
          }(Math); !
            function () {
              var t = n,
                e = t.lib,
                r = e.WordArray,
                o = e.Hasher,
                i = [],
                e = t.algo.SHA1 = o.extend({
                  _doReset: function () {
                    this._hash = new r.init([1732584193, 4023233417, 2562383102, 271733878, 3285377520])
                  },
                  _doProcessBlock: function (t, e) {
                    for (var n = this._hash.words,
                      r = n[0], o = n[1], a = n[2], s = n[3], u = n[4], c = 0; 80 > c; c++) {
                      if (16 > c) i[c] = 0 | t[e + c];
                      else {
                        var l = i[c - 3] ^ i[c - 8] ^ i[c - 14] ^ i[c - 16];
                        i[c] = l << 1 | l >>> 31
                      }
                      l = (r << 5 | r >>> 27) + u + i[c],
                        l = 20 > c ? l + (1518500249 + (o & a | ~o & s)) : 40 > c ? l + (1859775393 + (o ^ a ^ s)) : 60 > c ? l + ((o & a | o & s | a & s) - 1894007588) : l + ((o ^ a ^ s) - 899497514),
                        u = s,
                        s = a,
                        a = o << 30 | o >>> 2,
                        o = r,
                        r = l
                    }
                    n[0] = n[0] + r | 0,
                      n[1] = n[1] + o | 0,
                      n[2] = n[2] + a | 0,
                      n[3] = n[3] + s | 0,
                      n[4] = n[4] + u | 0
                  },
                  _doFinalize: function () {
                    var t = this._data,
                      e = t.words,
                      n = 8 * this._nDataBytes,
                      r = 8 * t.sigBytes;
                    return e[r >>> 5] |= 128 << 24 - r % 32,
                      e[14 + (r + 64 >>> 9 << 4)] = Math.floor(n / 4294967296),
                      e[15 + (r + 64 >>> 9 << 4)] = n,
                      t.sigBytes = 4 * e.length,
                      this._process(),
                      this._hash
                  },
                  clone: function () {
                    var t = o.clone.call(this);
                    return t._hash = this._hash.clone(),
                      t
                  }
                });
              t.SHA1 = o._createHelper(e),
                t.HmacSHA1 = o._createHmacHelper(e)
            }(),
            function () {
              var t = n,
                e = t.enc.Utf8;
              t.algo.HMAC = t.lib.Base.extend({
                init: function (t, n) {
                  t = this._hasher = new t.init,
                    "string" == typeof n && (n = e.parse(n));
                  var r = t.blockSize,
                    o = 4 * r;
                  n.sigBytes > o && (n = t.finalize(n)),
                    n.clamp();
                  for (var i = this._oKey = n.clone(), a = this._iKey = n.clone(), s = i.words, u = a.words, c = 0; c < r; c++) s[c] ^= 1549556828,
                    u[c] ^= 909522486;
                  i.sigBytes = a.sigBytes = o,
                    this.reset()
                },
                reset: function () {
                  var t = this._hasher;
                  t.reset(),
                    t.update(this._iKey)
                },
                update: function (t) {
                  return this._hasher.update(t),
                    this
                },
                finalize: function (t) {
                  var e = this._hasher;
                  return t = e.finalize(t),
                    e.reset(),
                    e.finalize(this._oKey.clone().concat(t))
                }
              })
            }(),
            function () {
              var t = n,
                e = t.lib,
                r = e.WordArray,
                o = t.enc;
              o.Base64 = {
                stringify: function (t) {
                  var e = t.words,
                    n = t.sigBytes,
                    r = this._map;
                  t.clamp();
                  for (var o = [], i = 0; i < n; i += 3) for (var a = e[i >>> 2] >>> 24 - i % 4 * 8 & 255, s = e[i + 1 >>> 2] >>> 24 - (i + 1) % 4 * 8 & 255, u = e[i + 2 >>> 2] >>> 24 - (i + 2) % 4 * 8 & 255, c = a << 16 | s << 8 | u, l = 0; l < 4 && i + .75 * l < n; l++) o.push(r.charAt(c >>> 6 * (3 - l) & 63));
                  var f = r.charAt(64);
                  if (f) for (; o.length % 4;) o.push(f);
                  return o.join("")
                },
                parse: function (t) {
                  var e = t.length,
                    n = this._map,
                    o = n.charAt(64);
                  if (o) {
                    var i = t.indexOf(o); - 1 != i && (e = i)
                  }
                  for (var a = [], s = 0, u = 0; u < e; u++) if (u % 4) {
                    var c = n.indexOf(t.charAt(u - 1)) << u % 4 * 2,
                      l = n.indexOf(t.charAt(u)) >>> 6 - u % 4 * 2;
                    a[s >>> 2] |= (c | l) << 24 - s % 4 * 8,
                      s++
                  }
                  return r.create(a, s)
                },
                _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
              }
            }(),
            t.exports = n
      },
      function (t, e) {
        var n = function (t) {
          "use strict";
          function e(t) {
            var e = t.localName;
            return null == e && (e = t.baseName),
              null != e && "" != e || (e = t.nodeName),
              e
          }
          function n(t) {
            return t.prefix
          }
          function r(t) {
            return "string" == typeof t ? t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;") : t
          }
          function o(t, e, n, r) {
            for (var o = 0; o < t.length; o++) {
              var i = t[o];
              if ("string" == typeof i) {
                if (i == r) break
              } else if (i instanceof RegExp) {
                if (i.test(r)) break
              } else if ("function" == typeof i && i(e, n, r)) break
            }
            return o != t.length
          }
          function i(e, n, r) {
            switch (t.arrayAccessForm) {
              case "property":
                e[n] instanceof Array ? e[n + "_asArray"] = e[n] : e[n + "_asArray"] = [e[n]]
            } !(e[n] instanceof Array) && t.arrayAccessFormPaths.length > 0 && o(t.arrayAccessFormPaths, e, n, r) && (e[n] = [e[n]])
          }
          function a(t) {
            var e = t.split(/[-T:+Z]/g),
              n = new Date(e[0], e[1] - 1, e[2]),
              r = e[5].split(".");
            if (n.setHours(e[3], e[4], r[0]), r.length > 1 && n.setMilliseconds(r[1]), e[6] && e[7]) {
              var o = 60 * e[6] + Number(e[7]);
              o = 0 + ("-" == (/\d\d-\d\d:\d\d$/.test(t) ? "-" : "+") ? -1 * o : o),
                n.setMinutes(n.getMinutes() - o - n.getTimezoneOffset())
            } else - 1 !== t.indexOf("Z", t.length - 1) && (n = new Date(Date.UTC(n.getFullYear(), n.getMonth(), n.getDate(), n.getHours(), n.getMinutes(), n.getSeconds(), n.getMilliseconds())));
            return n
          }
          function s(e, n, r) {
            if (t.datetimeAccessFormPaths.length > 0) {
              var i = r.split(".#")[0];
              return o(t.datetimeAccessFormPaths, e, n, i) ? a(e) : e
            }
            return e
          }
          function u(e, n, r, i) {
            return !(n == x.ELEMENT_NODE && t.xmlElementsFilter.length > 0) || o(t.xmlElementsFilter, e, r, i)
          }
          function c(r, o) {
            if (r.nodeType == x.DOCUMENT_NODE) {
              for (var a = new Object,
                l = r.childNodes,
                f = 0; f < l.length; f++) {
                var h = l.item(f);
                if (h.nodeType == x.ELEMENT_NODE) {
                  var d = e(h);
                  a[d] = c(h, d)
                }
              }
              return a
            }
            if (r.nodeType == x.ELEMENT_NODE) {
              var a = new Object;
              a.__cnt = 0;
              for (var l = r.childNodes,
                f = 0; f < l.length; f++) {
                var h = l.item(f),
                  d = e(h);
                if (h.nodeType != x.COMMENT_NODE) {
                  var p = o + "." + d;
                  u(a, h.nodeType, d, p) && (a.__cnt++ , null == a[d] ? (a[d] = c(h, p), i(a, d, p)) : (null != a[d] && (a[d] instanceof Array || (a[d] = [a[d]], i(a, d, p))), a[d][a[d].length] = c(h, p)))
                }
              }
              for (var g = 0; g < r.attributes.length; g++) {
                var y = r.attributes.item(g);
                a.__cnt++ ,
                  a[t.attributePrefix + y.name] = y.value
              }
              var v = n(r);
              return null != v && "" != v && (a.__cnt++ , a.__prefix = v),
                null != a["#text"] && (a.__text = a["#text"], a.__text instanceof Array && (a.__text = a.__text.join("\n")), t.stripWhitespaces && (a.__text = a.__text.trim()), delete a["#text"], "property" == t.arrayAccessForm && delete a["#text_asArray"], a.__text = s(a.__text, d, o + "." + d)),
                null != a["#cdata-section"] && (a.__cdata = a["#cdata-section"], delete a["#cdata-section"], "property" == t.arrayAccessForm && delete a["#cdata-section_asArray"]),
                0 == a.__cnt && "text" == t.emptyNodeForm ? a = "" : 1 == a.__cnt && null != a.__text ? a = a.__text : 1 != a.__cnt || null == a.__cdata || t.keepCData ? a.__cnt > 1 && null != a.__text && t.skipEmptyTextNodesForObj && (t.stripWhitespaces && "" == a.__text || "" == a.__text.trim()) && delete a.__text : a = a.__cdata,
                delete a.__cnt,
                !t.enableToStringFunc || null == a.__text && null == a.__cdata || (a.toString = function () {
                  return (null != this.__text ? this.__text : "") + (null != this.__cdata ? this.__cdata : "")
                }),
                a
            }
            if (r.nodeType == x.TEXT_NODE || r.nodeType == x.CDATA_SECTION_NODE) return r.nodeValue
          }
          function l(e, n, o, i) {
            var a = "<" + (null != e && null != e.__prefix ? e.__prefix + ":" : "") + n;
            if (null != o) for (var s = 0; s < o.length; s++) {
              var u = o[s],
                c = e[u];
              t.escapeMode && (c = r(c)),
                a += " " + u.substr(t.attributePrefix.length) + "=",
                t.useDoubleQuotes ? a += '"' + c + '"' : a += "'" + c + "'"
            }
            return a += i ? "/>" : ">"
          }
          function f(t, e) {
            return "</" + (null != t.__prefix ? t.__prefix + ":" : "") + e + ">"
          }
          function h(t, e) {
            return - 1 !== t.indexOf(e, t.length - e.length)
          }
          function d(e, n) {
            return !!("property" == t.arrayAccessForm && h(n.toString(), "_asArray") || 0 == n.toString().indexOf(t.attributePrefix) || 0 == n.toString().indexOf("__") || e[n] instanceof Function)
          }
          function p(t) {
            var e = 0;
            if (t instanceof Object) for (var n in t) d(t, n) || e++;
            return e
          }
          function g(e, n, r) {
            return 0 == t.jsonPropertiesFilter.length || "" == r || o(t.jsonPropertiesFilter, e, n, r)
          }
          function y(e) {
            var n = [];
            if (e instanceof Object) for (var r in e) - 1 == r.toString().indexOf("__") && 0 == r.toString().indexOf(t.attributePrefix) && n.push(r);
            return n
          }
          function v(e) {
            var n = "";
            return null != e.__cdata && (n += "<![CDATA[" + e.__cdata + "]]>"),
              null != e.__text && (t.escapeMode ? n += r(e.__text) : n += e.__text),
              n
          }
          function C(e) {
            var n = "";
            return e instanceof Object ? n += v(e) : null != e && (t.escapeMode ? n += r(e) : n += e),
              n
          }
          function m(t, e) {
            return "" === t ? e : t + "." + e
          }
          function A(t, e, n, r) {
            var o = "";
            if (0 == t.length) o += l(t, e, n, !0);
            else for (var i = 0; i < t.length; i++) o += l(t[i], e, y(t[i]), !1),
              o += _(t[i], m(r, e)),
              o += f(t[i], e);
            return o
          }
          function _(t, e) {
            var n = "";
            if (p(t) > 0) for (var r in t) if (!d(t, r) && ("" == e || g(t, r, m(e, r)))) {
              var o = t[r],
                i = y(o);
              if (null == o || void 0 == o) n += l(o, r, i, !0);
              else if (o instanceof Object) if (o instanceof Array) n += A(o, r, i, e);
              else if (o instanceof Date) n += l(o, r, i, !1),
                n += o.toISOString(),
                n += f(o, r);
              else {
                var a = p(o);
                a > 0 || null != o.__text || null != o.__cdata ? (n += l(o, r, i, !1), n += _(o, m(e, r)), n += f(o, r)) : n += l(o, r, i, !0)
              } else n += l(o, r, i, !1),
                n += C(o),
                n += f(o, r)
            }
            return n += C(t)
          }
          t = t || {},
            function () {
              void 0 === t.escapeMode && (t.escapeMode = !0),
                t.attributePrefix = t.attributePrefix || "_",
                t.arrayAccessForm = t.arrayAccessForm || "none",
                t.emptyNodeForm = t.emptyNodeForm || "text",
                void 0 === t.enableToStringFunc && (t.enableToStringFunc = !0),
                t.arrayAccessFormPaths = t.arrayAccessFormPaths || [],
                void 0 === t.skipEmptyTextNodesForObj && (t.skipEmptyTextNodesForObj = !0),
                void 0 === t.stripWhitespaces && (t.stripWhitespaces = !0),
                t.datetimeAccessFormPaths = t.datetimeAccessFormPaths || [],
                void 0 === t.useDoubleQuotes && (t.useDoubleQuotes = !1),
                t.xmlElementsFilter = t.xmlElementsFilter || [],
                t.jsonPropertiesFilter = t.jsonPropertiesFilter || [],
                void 0 === t.keepCData && (t.keepCData = !1)
            }();
          var x = {
            ELEMENT_NODE: 1,
            TEXT_NODE: 3,
            CDATA_SECTION_NODE: 4,
            COMMENT_NODE: 8,
            DOCUMENT_NODE: 9
          };
          this.parseXmlString = function (t) {
            if (void 0 === t) return null;
            var e;
            if (DOMParser) {
              var n = new DOMParser,
                r = null;
              try {
                r = n.parseFromString("INVALID", "text/xml").getElementsByTagName("parsererror")[0].namespaceURI
              } catch (t) {
                r = null
              }
              try {
                e = n.parseFromString(t, "text/xml"),
                  null != r && e.getElementsByTagNameNS(r, "parsererror").length > 0 && (e = null)
              } catch (t) {
                e = null
              }
            } else 0 == t.indexOf("<?") && (t = t.substr(t.indexOf("?>") + 2)),
              e = new ActiveXObject("Microsoft.XMLDOM"),
              e.async = "false",
              e.loadXML(t);
            return e
          },
            this.asArray = function (t) {
              return void 0 === t || null == t ? [] : t instanceof Array ? t : [t]
            },
            this.toXmlDateTime = function (t) {
              return t instanceof Date ? t.toISOString() : "number" == typeof t ? new Date(t).toISOString() : null
            },
            this.asDateTime = function (t) {
              return "string" == typeof t ? a(t) : t
            },
            this.xml2json = function (t) {
              return c(t)
            },
            this.xml_str2json = function (t) {
              var e = this.parseXmlString(t);
              return null != e ? this.xml2json(e) : null
            },
            this.json2xml_str = function (t) {
              return _(t, "")
            },
            this.json2xml = function (t) {
              var e = this.json2xml_str(t);
              return this.parseXmlString(e)
            },
            this.getVersion = function () {
              return "1.2.0"
            }
        },
          r = function (t) {
            var e = new DOMParser,
              r = e.parseFromString(t, "text/xml"),
              o = new n,
              i = o.xml2json(r);
            return i.html && i.getElementsByTagName("parsererror").length ? null : i
          };
        t.exports = r
      },
      function (t, e) {
        function n(t) {
          return ("" + t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/'/g, "&apos;").replace(/"/g, "&quot;").replace(o, "")
        }
        var r = new RegExp("^([^a-zA-Z_À-ÖØ-öø-ÿͰ-ͽͿ-῿‌-‍⁰-↏Ⰰ-⿿、-퟿豈-﷏ﷰ-�])|^((x|X)(m|M)(l|L))|([^a-zA-Z_À-ÖØ-öø-ÿͰ-ͽͿ-῿‌-‍⁰-↏Ⰰ-⿿、-퟿豈-﷏ﷰ-�-.0-9·̀-ͯ‿⁀])", "g"),
          o = /[^\x09\x0A\x0D\x20-\xFF\x85\xA0-\uD7FF\uE000-\uFDCF\uFDE0-\uFFFD]/gm,
          i = function (t) {
            var e = [];
            if (t instanceof Object) for (var n in t) t.hasOwnProperty(n) && e.push(n);
            return e
          },
          a = function (t, e) {
            var o = function (t, n, o, i, a) {
              var s = void 0 !== e.indent ? e.indent : "\t",
                u = e.prettyPrint ? "\n" + new Array(i).join(s) : "";
              e.removeIllegalNameCharacters && (t = t.replace(r, "_"));
              var c = [u, "<", t, o || ""];
              return n && n.length > 0 ? (c.push(">"), c.push(n), a && c.push(u), c.push("</"), c.push(t), c.push(">")) : c.push("/>"),
                c.join("")
            };
            return function t(r, a, s) {
              var u = typeof r;
              switch ((Array.isArray ? Array.isArray(r) : r instanceof Array) ? u = "array" : r instanceof Date && (u = "date"), u) {
                case "array":
                  var c = [];
                  return r.map(function (e) {
                    c.push(t(e, 1, s + 1))
                  }),
                    e.prettyPrint && c.push("\n"),
                    c.join("");
                case "date":
                  return r.toJSON ? r.toJSON() : r + "";
                case "object":
                  var l = [];
                  for (var f in r) if (r[f] instanceof Array) for (var h in r[f]) l.push(o(f, t(r[f][h], 0, s + 1), null, s + 1, i(r[f][h]).length));
                  else l.push(o(f, t(r[f], 0, s + 1), null, s + 1));
                  return e.prettyPrint && l.length > 0 && l.push("\n"),
                    l.join("");
                case "function":
                  return r();
                default:
                  return e.escape ? n(r) : "" + r
              }
            }(t, 0, 0)
          },
          s = function (t) {
            var e = ['<?xml version="1.0" encoding="UTF-8"'];
            return t && e.push(' standalone="yes"'),
              e.push("?>"),
              e.join("")
          },
          u = function (t, e) {
            e || (e = {
              xmlHeader: {
                standalone: !0
              },
              prettyPrint: !0,
              indent: "  "
            });
            var n = this.Buffer ||
              function () { };
            if ("string" == typeof t || t instanceof n) try {
              t = JSON.parse(t.toString())
            } catch (t) {
              return !1
            }
            var r = "",
              o = "";
            return e && ("object" == typeof e ? (e.xmlHeader && (r = s(!!e.xmlHeader.standalone)), void 0 !== e.docType && (o = "<!DOCTYPE " + e.docType + ">")) : r = s()),
              e = e || {},
              [r, e.prettyPrint && o ? "\n" : "", o, a(t, e)].join("").replace(/\n{2,}/g, "\n").replace(/\s+$/g, "")
          };
        t.exports = u
      },
      function (t, e) {
        var n = function (t) {
          var e = {},
            n = function (t) {
              return !e[t] && (e[t] = []),
                e[t]
            };
          t.on = function (t, e) {
            n(t).push(e)
          },
            t.off = function (t, e) {
              for (var r = n(t), o = r.length - 1; o >= 0; o--) e === r[o] && r.splice(o, 1)
            },
            t.emit = function (t, e) {
              for (var r = n(t).map(function (t) {
                return t
              }), o = 0; o < r.length; o++) r[o](e)
            }
        },
          r = function () {
            n(this)
          };
        t.exports.init = n,
          t.exports.EventProxy = r
      },
      function (t, e, n) {
        var r = n(0),
          o = function (t) {
            var e = [],
              n = {},
              o = 0,
              i = 0,
              a = {};
            r.each(["postObject"],
              function (e) {
                a[e] = t[e],
                  t[e] = function (n, r) {
                    t._addTask(e, n, r)
                  }
              });
            var s = function (t) {
              var e = {
                id: t.id,
                Bucket: t.Bucket,
                Region: t.Region,
                Key: t.Key,
                FilePath: t.FilePath,
                state: t.state,
                loaded: t.loaded,
                size: t.size,
                speed: t.speed,
                percent: t.percent,
                hashPercent: t.hashPercent
              };
              return t.FilePath && (e.FilePath = t.FilePath),
                e
            },
              u = function () {
                t.emit("list-update", {
                  list: r.map(e, s)
                })
              },
              c = function () {
                if (i < e.length && o < t.options.FileParallelLimit) {
                  var n = e[i];
                  "waiting" === n.state && (o++ , n.state = "checking", !n.params.UploadData && (n.params.UploadData = {}), a[n.api].call(t, n.params,
                    function (e, r) {
                      "checking" !== n.state && "uploading" !== n.state || (n.state = e ? "error" : "success", o-- , c(t), n.callback && n.callback(e, r), "success" === n.state && (delete n.params, delete n.callback))
                    }), u()),
                    i++ ,
                    c(t)
                }
              },
              l = function (e, r) {
                var i = n[e];
                if (i) {
                  var a = i && "waiting" === i.state,
                    s = i && ("checking" === i.state || "uploading" === i.state);
                  if (a || s || "canceled" === r && "paused" === i.state) {
                    if ("paused" === r && i.params.Body && "function" == typeof i.params.Body.pipe) return void console.error("stream not support pause");
                    i.state = r,
                      t.emit("inner-kill-task", {
                        TaskId: e
                      }),
                      u(),
                      s && (o-- , c(t)),
                      "canceled" === r && (delete i.params, delete i.callback)
                  }
                }
              };
            t._addTasks = function (e) {
              r.each(e,
                function (e) {
                  e.params.IgnoreAddEvent = !0,
                    t._addTask(e.api, e.params, e.callback)
                }),
                u()
            },
              t._addTask = function (o, i, a) {
                var s = r.uuid();
                i.TaskReady && i.TaskReady(s);
                var l;
                i.Body && i.Body.size ? l = i.Body.size : i.Body && i.Body.length ? l = i.Body.length : void 0 !== i.ContentLength && (l = i.ContentLength),
                  void 0 === i.ContentLength && (i.ContentLength = l),
                  i.TaskId = s;
                var f = {
                  params: i,
                  callback: a,
                  api: o,
                  index: e.length,
                  id: s,
                  Bucket: i.Bucket,
                  Region: i.Region,
                  Key: i.Key,
                  FilePath: i.FilePath || "",
                  state: "waiting",
                  loaded: 0,
                  size: l,
                  speed: 0,
                  percent: 0,
                  hashPercent: 0
                },
                  h = i.onHashProgress;
                i.onHashProgress = function (e) {
                  t._isRunningTask(f.id) && (f.hashPercent = e.percent, h && h(e), u())
                };
                var d = i.onProgress;
                return i.onProgress = function (e) {
                  t._isRunningTask(f.id) && ("checking" === f.state && (f.state = "uploading"), f.loaded = e.loaded, f.speed = e.speed, f.percent = e.percent, d && d(e), u())
                },
                  e.push(f),
                  n[s] = f,
                  !i.IgnoreAddEvent && u(),
                  c(t),
                  s
              },
              t._isRunningTask = function (t) {
                var e = n[t];
                return !(!e || "checking" !== e.state && "uploading" !== e.state)
              },
              t.getTaskList = function () {
                return r.map(e, s)
              },
              t.cancelTask = function (t) {
                l(t, "canceled")
              },
              t.pauseTask = function (t) {
                l(t, "paused")
              },
              t.restartTask = function (t) {
                var e = n[t]; !e || "paused" !== e.state && "error" !== e.state || (e.state = "waiting", u(), i = Math.min(i, e.index), c())
              }
          };
        t.exports.init = o
      },
      function (t, e, n) {
        "use strict"; (function (t) {
          function r(t, e) {
            "function" == typeof t && (e = t, t = {});
            var n = this.options.ServiceDomain,
              r = t.AppId || this.options.appId;
            n ? (n = n.replace(/\{\{AppId\}\}/gi, r || "").replace(/\{\{.*?\}\}/gi, ""), /^[a-zA-Z]+:\/\//.test(n) || (n = "https://" + n), "/" === n.slice(- 1) && (n = n.slice(0, -1))) : n = "https://service.cos.myqcloud.com",
              L.call(this, {
                url: n + "/",
                method: "GET"
              },
                function (t, n) {
                  if (t) return e(t);
                  var r = n && n.ListAllMyBucketsResult && n.ListAllMyBucketsResult.Buckets && n.ListAllMyBucketsResult.Buckets.Bucket || [];
                  r = j.isArray(r) ? r : [r],
                    e(null, {
                      Buckets: r,
                      statusCode: n.statusCode,
                      headers: n.headers
                    })
                })
          }
          function o(t, e) {
            L.call(this, {
              Bucket: t.Bucket,
              Region: t.Region,
              method: "HEAD"
            },
              function (t, n) {
                var r, o, i;
                if (t) if ((i = t.statusCode) && 404 === i) r = !1,
                  o = !1;
                else {
                  if (!i || 403 !== i) return e(t);
                  r = !0,
                    o = !1
                } else i = n.statusCode,
                  r = !0,
                  o = !0;
                var a = {
                  BucketExist: r,
                  BucketAuth: o,
                  statusCode: i
                };
                n && n.headers && (a.headers = n.headers),
                  e(null, a)
              })
          }
          function i(t, e) {
            var n = {};
            n.prefix = t.Prefix,
              n.delimiter = t.Delimiter,
              n.marker = t.Marker,
              n["max-keys"] = t.MaxKeys,
              n["encoding-type"] = t.EncodingType,
              L.call(this, {
                method: "GET",
                Bucket: t.Bucket,
                Region: t.Region,
                qs: n
              },
                function (t, n) {
                  if (t) return e(t);
                  var r = n.ListBucketResult.Contents || [],
                    o = n.ListBucketResult.CommonPrefixes || [];
                  r = j.isArray(r) ? r : [r],
                    o = j.isArray(o) ? o : [o];
                  var i = j.clone(n.ListBucketResult);
                  j.extend(i, {
                    Contents: r,
                    CommonPrefixes: o,
                    statusCode: n.statusCode,
                    headers: n.headers
                  }),
                    e(null, i)
                })
          }
          function a(t, e) {
            var n = this,
              r = {};
            r["x-cos-acl"] = t.ACL,
              r["x-cos-grant-read"] = t.GrantRead,
              r["x-cos-grant-write"] = t.GrantWrite,
              r["x-cos-grant-read-acp"] = t.GrantReadAcp,
              r["x-cos-grant-write-acp"] = t.GrantWriteAcp,
              r["x-cos-grant-full-control"] = t.GrantFullControl,
              L.call(this, {
                method: "PUT",
                Bucket: t.Bucket,
                Region: t.Region,
                headers: r
              },
                function (r, o) {
                  if (r) return e(r);
                  var i = D({
                    domain: n.options.Domain,
                    bucket: t.Bucket,
                    region: t.Region,
                    isLocation: !0
                  });
                  e(null, {
                    Location: i,
                    statusCode: o.statusCode,
                    headers: o.headers
                  })
                })
          }
          function s(t, e) {
            L.call(this, {
              method: "DELETE",
              Bucket: t.Bucket,
              Region: t.Region
            },
              function (t, n) {
                return t && 204 === t.statusCode ? e(null, {
                  statusCode: t.statusCode
                }) : t ? e(t) : void e(null, {
                  statusCode: n.statusCode,
                  headers: n.headers
                })
              })
          }
          function u(t, e) {
            L.call(this, {
              method: "GET",
              Bucket: t.Bucket,
              Region: t.Region,
              action: "/?acl"
            },
              function (t, n) {
                if (t) return e(t);
                var r = n.AccessControlPolicy.Owner || {},
                  o = n.AccessControlPolicy.AccessControlList.Grant || [];
                o = j.isArray(o) ? o : [o];
                var i = I(n.AccessControlPolicy);
                n.headers && n.headers["x-cos-acl"] && (i.ACL = n.headers["x-cos-acl"]),
                  i = j.extend(i, {
                    Owner: r,
                    Grants: o,
                    statusCode: n.statusCode,
                    headers: n.headers
                  }),
                  e(null, i)
              })
          }
          function c(t, e) {
            var n = {};
            n["x-cos-acl"] = t.ACL,
              n["x-cos-grant-read"] = t.GrantRead,
              n["x-cos-grant-write"] = t.GrantWrite,
              n["x-cos-grant-read-acp"] = t.GrantReadAcp,
              n["x-cos-grant-write-acp"] = t.GrantWriteAcp,
              n["x-cos-grant-full-control"] = t.GrantFullControl;
            var r = "";
            if (t.AccessControlPolicy) {
              var o = j.clone(t.AccessControlPolicy || {}),
                i = o.Grants || o.Grant;
              i = j.isArray(i) ? i : [i],
                delete o.Grant,
                delete o.Grants,
                o.AccessControlList = {
                  Grant: i
                },
                r = j.json2xml({
                  AccessControlPolicy: o
                }),
                n["Content-MD5"] = j.binaryBase64(j.md5(r)),
                n["Content-Type"] = "application/xml"
            }
            L.call(this, {
              method: "PUT",
              Bucket: t.Bucket,
              Region: t.Region,
              action: "/?acl",
              headers: n,
              body: r
            },
              function (t, n) {
                if (t) return e(t);
                e(null, {
                  statusCode: n.statusCode,
                  headers: n.headers
                })
              })
          }
          function l(t, e) {
            L.call(this, {
              method: "GET",
              Bucket: t.Bucket,
              Region: t.Region,
              action: "/?cors"
            },
              function (t, n) {
                if (t) if (404 === t.statusCode && t.error && "NoSuchCORSConfiguration" === t.error.Code) {
                  var r = {
                    CORSRules: [],
                    statusCode: t.statusCode
                  };
                  t.headers && (r.headers = t.headers),
                    e(null, r)
                } else e(t);
                else {
                  var o = n.CORSConfiguration || {},
                    i = o.CORSRules || o.CORSRule || [];
                  i = j.clone(j.isArray(i) ? i : [i]),
                    j.each(i,
                      function (t) {
                        j.each(["AllowedOrigin", "AllowedHeader", "AllowedMethod", "ExposeHeader"],
                          function (e, n) {
                            var r = e + "s",
                              o = t[r] || t[e] || [];
                            delete t[e],
                              t[r] = j.isArray(o) ? o : [o]
                          })
                      }),
                    e(null, {
                      CORSRules: i,
                      statusCode: n.statusCode,
                      headers: n.headers
                    })
                }
              })
          }
          function f(t, e) {
            var n = t.CORSConfiguration || {},
              r = n.CORSRules || t.CORSRules || [];
            r = j.clone(j.isArray(r) ? r : [r]),
              j.each(r,
                function (t) {
                  j.each(["AllowedOrigin", "AllowedHeader", "AllowedMethod", "ExposeHeader"],
                    function (e, n) {
                      var r = e + "s",
                        o = t[r] || t[e] || [];
                      delete t[r],
                        t[e] = j.isArray(o) ? o : [o]
                    })
                });
            var o = j.json2xml({
              CORSConfiguration: {
                CORSRule: r
              }
            }),
              i = {};
            i["Content-MD5"] = j.binaryBase64(j.md5(o)),
              i["Content-Type"] = "application/xml",
              L.call(this, {
                method: "PUT",
                Bucket: t.Bucket,
                Region: t.Region,
                body: o,
                action: "/?cors",
                headers: i
              },
                function (t, n) {
                  if (t) return e(t);
                  e(null, {
                    statusCode: n.statusCode,
                    headers: n.headers
                  })
                })
          }
          function h(t, e) {
            L.call(this, {
              method: "DELETE",
              Bucket: t.Bucket,
              Region: t.Region,
              action: "/?cors"
            },
              function (t, n) {
                return t && 204 === t.statusCode ? e(null, {
                  statusCode: t.statusCode
                }) : t ? e(t) : void e(null, {
                  statusCode: n.statusCode || t.statusCode,
                  headers: n.headers
                })
              })
          }
          function d(t, e) {
            var n = {},
              r = t.Policy,
              o = r;
            try {
              "string" == typeof r ? r = JSON.parse(o) : o = JSON.stringify(r)
            } catch (t) {
              e({
                error: "Policy format error"
              })
            }
            n["Content-Type"] = "application/json",
              n["Content-MD5"] = j.binaryBase64(j.md5(o)),
              L.call(this, {
                method: "PUT",
                Bucket: t.Bucket,
                Region: t.Region,
                action: "/?policy",
                body: o,
                headers: n,
                json: !0
              },
                function (t, n) {
                  return t && 204 === t.statusCode ? e(null, {
                    statusCode: t.statusCode
                  }) : t ? e(t) : void e(null, {
                    statusCode: n.statusCode,
                    headers: n.headers
                  })
                })
          }
          function p(t, e) {
            L.call(this, {
              method: "GET",
              Bucket: t.Bucket,
              Region: t.Region,
              action: "/?location"
            },
              function (t, n) {
                if (t) return e(t);
                e(null, n)
              })
          }
          function g(t, e) {
            L.call(this, {
              method: "GET",
              Bucket: t.Bucket,
              Region: t.Region,
              action: "/?policy",
              rawBody: !0
            },
              function (t, n) {
                if (t) return e(t.statusCode && 403 === t.statusCode ? {
                  ErrorStatus: "Access Denied"
                } : t.statusCode && 405 === t.statusCode ? {
                  ErrorStatus: "Method Not Allowed"
                } : t.statusCode && 404 === t.statusCode ? {
                  ErrorStatus: "Policy Not Found"
                } : t);
                var r = {};
                try {
                  r = JSON.parse(n.body)
                } catch (t) { }
                e(null, {
                  Policy: r,
                  statusCode: n.statusCode,
                  headers: n.headers
                })
              })
          }
          function y(t, e) {
            L.call(this, {
              method: "GET",
              Bucket: t.Bucket,
              Region: t.Region,
              action: "/?tagging"
            },
              function (t, n) {
                if (t) if (404 !== t.statusCode || !t.error || "Not Found" !== t.error && "NoSuchTagSet" !== t.error.Code) e(t);
                else {
                  var r = {
                    Tags: [],
                    statusCode: t.statusCode
                  };
                  t.headers && (r.headers = t.headers),
                    e(null, r)
                } else {
                  var o = [];
                  try {
                    o = n.Tagging.TagSet.Tag || []
                  } catch (t) { }
                  o = j.clone(j.isArray(o) ? o : [o]),
                    e(null, {
                      Tags: o,
                      statusCode: n.statusCode,
                      headers: n.headers
                    })
                }
              })
          }
          function v(t, e) {
            var n = t.Tagging || {},
              r = n.TagSet || n.Tags || t.Tags || [];
            r = j.clone(j.isArray(r) ? r : [r]);
            var o = j.json2xml({
              Tagging: {
                TagSet: {
                  Tag: r
                }
              }
            }),
              i = {};
            i["Content-Type"] = "application/xml",
              i["Content-MD5"] = j.binaryBase64(j.md5(o)),
              L.call(this, {
                method: "PUT",
                Bucket: t.Bucket,
                Region: t.Region,
                body: o,
                action: "/?tagging",
                headers: i
              },
                function (t, n) {
                  return t && 204 === t.statusCode ? e(null, {
                    statusCode: t.statusCode
                  }) : t ? e(t) : void e(null, {
                    statusCode: n.statusCode,
                    headers: n.headers
                  })
                })
          }
          function C(t, e) {
            L.call(this, {
              method: "DELETE",
              Bucket: t.Bucket,
              Region: t.Region,
              action: "/?tagging"
            },
              function (t, n) {
                return t && 204 === t.statusCode ? e(null, {
                  statusCode: t.statusCode
                }) : t ? e(t) : void e(null, {
                  statusCode: n.statusCode,
                  headers: n.headers
                })
              })
          }
          function m(t, e) {
            var n = t.LifecycleConfiguration || {},
              r = n.Rules || [];
            r = j.clone(r);
            var o = j.json2xml({
              LifecycleConfiguration: {
                Rule: r
              }
            }),
              i = {};
            i["Content-Type"] = "application/xml",
              i["Content-MD5"] = j.binaryBase64(j.md5(o)),
              L.call(this, {
                method: "PUT",
                Bucket: t.Bucket,
                Region: t.Region,
                body: o,
                action: "/?lifecycle",
                headers: i
              },
                function (t, n) {
                  return t && 204 === t.statusCode ? e(null, {
                    statusCode: t.statusCode
                  }) : t ? e(t) : void e(null, {
                    statusCode: n.statusCode,
                    headers: n.headers
                  })
                })
          }
          function A(t, e) {
            L.call(this, {
              method: "GET",
              Bucket: t.Bucket,
              Region: t.Region,
              action: "/?lifecycle"
            },
              function (t, n) {
                if (t) if (404 === t.statusCode && t.error && "NoSuchLifecycleConfiguration" === t.error.Code) {
                  var r = {
                    Rules: [],
                    statusCode: t.statusCode
                  };
                  t.headers && (r.headers = t.headers),
                    e(null, r)
                } else e(t);
                else {
                  var o = [];
                  try {
                    o = n.LifecycleConfiguration.Rule || []
                  } catch (t) { }
                  o = j.clone(j.isArray(o) ? o : [o]),
                    e(null, {
                      Rules: o,
                      statusCode: n.statusCode,
                      headers: n.headers
                    })
                }
              })
          }
          function _(t, e) {
            L.call(this, {
              method: "DELETE",
              Bucket: t.Bucket,
              Region: t.Region,
              action: "/?lifecycle"
            },
              function (t, n) {
                return t && 204 === t.statusCode ? e(null, {
                  statusCode: t.statusCode
                }) : t ? e(t) : void e(null, {
                  statusCode: n.statusCode,
                  headers: n.headers
                })
              })
          }
          function x(t, e) {
            var n = {};
            n["If-Modified-Since"] = t.IfModifiedSince,
              L.call(this, {
                method: "HEAD",
                Bucket: t.Bucket,
                Region: t.Region,
                Key: t.Key,
                headers: n
              },
                function (t, r) {
                  if (t) {
                    var o = t.statusCode;
                    return n["If-Modified-Since"] && o && 304 === o ? e(null, {
                      NotModified: !0,
                      statusCode: o
                    }) : e(t)
                  }
                  e(null, r)
                })
          }
          function w(t, e) {
            var n = {},
              r = {};
            n.Range = t.Range,
              n["If-Modified-Since"] = t.IfModifiedSince,
              n["If-Unmodified-Since"] = t.IfUnmodifiedSince,
              n["If-Match"] = t.IfMatch,
              n["If-None-Match"] = t.IfNoneMatch,
              r["response-content-type"] = t.ResponseContentType,
              r["response-content-language"] = t.ResponseContentLanguage,
              r["response-expires"] = t.ResponseExpires,
              r["response-cache-control"] = t.ResponseCacheControl,
              r["response-content-disposition"] = t.ResponseContentDisposition,
              r["response-content-encoding"] = t.ResponseContentEncoding;
            var o;
            o = "string",
              L.call(this, {
                method: "GET",
                Bucket: t.Bucket,
                Region: t.Region,
                Key: t.Key,
                headers: n,
                qs: r,
                rawBody: !0
              },
                function (t, r) {
                  if (t) {
                    var i = t.statusCode;
                    return n["If-Modified-Since"] && i && 304 === i ? e(null, {
                      NotModified: !0
                    }) : e(t)
                  }
                  var a = {};
                  "string" === o && (a.Body = r.body),
                    j.extend(a, {
                      statusCode: r.statusCode,
                      headers: r.headers
                    }),
                    e(null, a)
                })
          }
          function R(t, e) {
            var n = this,
              r = {};
            r["Cache-Control"] = t.CacheControl,
              r["Content-Disposition"] = t.ContentDisposition,
              r["Content-Encoding"] = t.ContentEncoding,
              r["Content-MD5"] = t.ContentMD5,
              r["Content-Length"] = t.ContentLength,
              r["Content-Type"] = t.ContentType,
              r.Expect = t.Expect,
              r.Expires = t.Expires,
              r["x-cos-acl"] = t.ACL,
              r["x-cos-grant-read"] = t.GrantRead,
              r["x-cos-grant-write"] = t.GrantWrite,
              r["x-cos-grant-full-control"] = t.GrantFullControl,
              r["x-cos-storage-class"] = t.StorageClass;
            for (var o in t) o.indexOf("x-cos-meta-") > -1 && (r[o] = t[o]);
            var i = t.Body;
            if (!i || "string" != typeof i) return void e({
              error: "params body format error, Only allow Buffer, Stream, Blob."
            });
            r["Content-Length"] = i.length,
              L.call(this, {
                TaskId: t.TaskId,
                method: "PUT",
                Bucket: t.Bucket,
                Region: t.Region,
                Key: t.Key,
                headers: r,
                body: i
              },
                function (r, o) {
                  if (r) return e(r);
                  if (o && o.headers && o.headers.etag) {
                    var i = D({
                      domain: n.options.Domain,
                      bucket: t.Bucket,
                      region: t.Region,
                      object: t.Key
                    });
                    return e(null, {
                      Location: i,
                      ETag: o.headers.etag,
                      statusCode: o.statusCode,
                      headers: o.headers
                    })
                  }
                  e(null, o)
                })
          }
          function B(t, e) {
            var n = this,
              r = {};
            r["Cache-Control"] = t.CacheControl,
              r["Content-Disposition"] = t.ContentDisposition,
              r["Content-Encoding"] = t.ContentEncoding,
              r["Content-MD5"] = t.ContentMD5,
              r["Content-Length"] = t.ContentLength,
              r["Content-Type"] = t.ContentType,
              r.Expect = t.Expect,
              r.Expires = t.Expires,
              r["x-cos-acl"] = t.ACL,
              r["x-cos-grant-read"] = t.GrantRead,
              r["x-cos-grant-write"] = t.GrantWrite,
              r["x-cos-grant-full-control"] = t.GrantFullControl,
              r["x-cos-storage-class"] = t.StorageClass;
            var o = t.FilePath;
            for (var i in t) i.indexOf("x-cos-meta-") > -1 && (r[i] = t[i]);
            var a = j.throttleOnProgress.call(n, r["Content-Length"], t.onProgress);
            L.call(this, {
              method: "POST",
              Bucket: t.Bucket,
              Region: t.Region,
              Key: t.Key,
              headers: r,
              filePath: o,
              onProgress: a
            },
              function (r, o) {
                if (a(null, !0), r) return e(r);
                if (o && o.headers && o.headers.etag) {
                  var i = D({
                    domain: n.options.Domain,
                    bucket: t.Bucket,
                    region: t.Region,
                    object: t.Key
                  });
                  return e(null, {
                    Location: i,
                    ETag: o.headers.etag,
                    statusCode: o.statusCode,
                    headers: o.headers
                  })
                }
                e(null, o)
              })
          }
          function E(t, e) {
            L.call(this, {
              method: "DELETE",
              Bucket: t.Bucket,
              Region: t.Region,
              Key: t.Key
            },
              function (t, n) {
                if (t) {
                  var r = t.statusCode;
                  return r && 204 === r ? e(null, {
                    statusCode: r
                  }) : r && 404 === r ? e(null, {
                    BucketNotFound: !0,
                    statusCode: r
                  }) : e(t)
                }
                e(null, {
                  statusCode: n.statusCode,
                  headers: n.headers
                })
              })
          }
          function T(t, e) {
            L.call(this, {
              method: "GET",
              Bucket: t.Bucket,
              Region: t.Region,
              Key: t.Key,
              action: "?acl"
            },
              function (t, n) {
                if (t) return e(t);
                var r = n.AccessControlPolicy.Owner || {},
                  o = n.AccessControlPolicy.AccessControlList.Grant || [];
                o = j.isArray(o) ? o : [o];
                var i = I(n.AccessControlPolicy);
                n.headers && n.headers["x-cos-acl"] && (i.ACL = n.headers["x-cos-acl"]),
                  i = j.extend(i, {
                    Owner: r,
                    Grants: o,
                    statusCode: n.statusCode,
                    headers: n.headers
                  }),
                  e(null, i)
              })
          }
          function k(t, e) {
            var n = {};
            n["x-cos-acl"] = t.ACL,
              n["x-cos-grant-read"] = t.GrantRead,
              n["x-cos-grant-write"] = t.GrantWrite,
              n["x-cos-grant-full-control"] = t.GrantFullControl;
            var r = "";
            if (t.AccessControlPolicy) {
              var o = j.clone(t.AccessControlPolicy || {}),
                i = o.Grants || o.Grant;
              i = j.isArray(i) ? i : [i],
                delete o.Grant,
                delete o.Grants,
                o.AccessControlList = {
                  Grant: i
                },
                r = j.json2xml({
                  AccessControlPolicy: o
                }),
                n["Content-MD5"] = j.binaryBase64(j.md5(r)),
                n["Content-Type"] = "application/xml"
            }
            L.call(this, {
              method: "PUT",
              Bucket: t.Bucket,
              Region: t.Region,
              Key: t.Key,
              action: "?acl",
              headers: n,
              body: r
            },
              function (t, n) {
                if (t) return e(t);
                e(null, {
                  statusCode: n.statusCode,
                  headers: n.headers
                })
              })
          }
          function b(t, e) {
            var n = {};
            n.Origin = t.Origin,
              n["Access-Control-Request-Method"] = t.AccessControlRequestMethod,
              n["Access-Control-Request-Headers"] = t.AccessControlRequestHeaders,
              L.call(this, {
                method: "OPTIONS",
                Bucket: t.Bucket,
                Region: t.Region,
                Key: t.Key,
                headers: n
              },
                function (t, n) {
                  if (t) return t.statusCode && 403 == t.statusCode ? e(null, {
                    OptionsForbidden: !0,
                    statusCode: t.statusCode
                  }) : e(t);
                  var r = n.headers || {};
                  e(null, {
                    AccessControlAllowOrigin: r["access-control-allow-origin"],
                    AccessControlAllowMethods: r["access-control-allow-methods"],
                    AccessControlAllowHeaders: r["access-control-allow-headers"],
                    AccessControlExposeHeaders: r["access-control-expose-headers"],
                    AccessControlMaxAge: r["access-control-max-age"],
                    statusCode: n.statusCode,
                    headers: n.headers
                  })
                })
          }
          function S(t, e) {
            var n = {};
            n["x-cos-copy-source"] = t.CopySource,
              n["x-cos-metadata-directive"] = t.MetadataDirective,
              n["x-cos-copy-source-If-Modified-Since"] = t.CopySourceIfModifiedSince,
              n["x-cos-copy-source-If-Unmodified-Since"] = t.CopySourceIfUnmodifiedSince,
              n["x-cos-copy-source-If-Match"] = t.CopySourceIfMatch,
              n["x-cos-copy-source-If-None-Match"] = t.CopySourceIfNoneMatch,
              n["x-cos-storage-class"] = t.StorageClass,
              n["x-cos-acl"] = t.ACL,
              n["x-cos-grant-read"] = t.GrantRead,
              n["x-cos-grant-write"] = t.GrantWrite,
              n["x-cos-grant-full-control"] = t.GrantFullControl,
              n["Cache-Control"] = t.CacheControl,
              n["Content-Disposition"] = t.ContentDisposition,
              n["Content-Encoding"] = t.ContentEncoding,
              n["Content-Length"] = t.ContentLength,
              n["Content-Type"] = t.ContentType,
              n.Expect = t.Expect,
              n.Expires = t.Expires;
            for (var r in t) r.indexOf("x-cos-meta-") > -1 && (n[r] = t[r]);
            L.call(this, {
              method: "PUT",
              Bucket: t.Bucket,
              Region: t.Region,
              Key: t.Key,
              headers: n
            },
              function (t, n) {
                if (t) return e(t);
                var r = j.clone(n.CopyObjectResult);
                j.extend(r, {
                  statusCode: n.statusCode,
                  headers: n.headers
                }),
                  e(null, r)
              })
          }
          function P(t) {
            return j.getAuth({
              Method: t.Method,
              Key: t.Key,
              Expires: t.Expires,
              SecretId: t.SecretId || this.options.SecretId || "",
              SecretKey: t.SecretKey || this.options.SecretKey || ""
            })
          }
          function O(t, e) {
            var n = this,
              r = D({
                domain: n.options.Domain,
                bucket: t.Bucket,
                region: t.Region,
                object: t.Key
              });
            if (void 0 !== t.Sign && !t.Sign) return e(null, {
              Url: r
            }),
              r;
            var o = M.call(this, {
              Method: t.Method || "get",
              Key: t.Key
            },
              function (t) {
                if (e) {
                  var n = {
                    Url: r + "?sign=" + encodeURIComponent(t.Authorization)
                  };
                  t.XCosSecurityToken && (n.XCosSecurityToken = t.XCosSecurityToken),
                    t.ClientIP && (n.ClientIP = t.ClientIP),
                    t.ClientUA && (n.ClientUA = t.ClientUA),
                    t.Token && (n.Token = t.Token),
                    setTimeout(function () {
                      e(null, n)
                    })
                }
              });
            return o ? r + "?sign=" + encodeURIComponent(o) : r
          }
          function I(t) {
            var e = {
              GrantFullControl: [],
              GrantWrite: [],
              GrantRead: [],
              GrantReadAcp: [],
              GrantWriteAcp: [],
              ACL: ""
            },
              n = {
                FULL_CONTROL: "GrantFullControl",
                WRITE: "GrantWrite",
                READ: "GrantRead",
                READ_ACP: "GrantReadAcp",
                WRITE_ACP: "GrantWriteAcp"
              },
              r = t.AccessControlList.Grant;
            r && (r = j.isArray(r) ? r : [r]);
            var o = {
              READ: 0,
              WRITE: 0,
              FULL_CONTROL: 0
            };
            return r.length && j.each(r,
              function (r) {
                "qcs::cam::anyone:anyone" === r.Grantee.ID || "http://cam.qcloud.com/groups/global/AllUsers" === r.Grantee.URI ? o[r.Permission] = 1 : r.Grantee.ID !== t.Owner.ID && e[n[r.Permission]].push('id="' + r.Grantee.ID + '"')
              }),
              o.FULL_CONTROL || o.WRITE && o.READ ? e.ACL = "public-read-write" : o.READ ? e.ACL = "public-read" : e.ACL = "private",
              j.each(n,
                function (t) {
                  e[t] = e[t].join(",")
                }),
              e
          }
          function D(t) {
            var e = t.bucket,
              n = e.substr(0, e.lastIndexOf("-")),
              r = e.substr(e.lastIndexOf("-") + 1),
              o = t.domain,
              i = t.region,
              a = t.object,
              s = t.action;
            o || (o = ["cn-south", "cn-south-2", "cn-north", "cn-east", "cn-southwest", "sg"].indexOf(i) > -1 ? "{{Bucket}}-{{AppId}}.{{Region}}.myqcloud.com" : "{{Bucket}}-{{AppId}}.cos.{{Region}}.myqcloud.com"),
              o = o.replace(/\{\{AppId\}\}/gi, r).replace(/\{\{Bucket\}\}/gi, n).replace(/\{\{Region\}\}/gi, i).replace(/\{\{.*?\}\}/gi, ""),
              /^[a-zA-Z]+:\/\//.test(o) || (o = "https://" + o),
              "/" === o.slice(- 1) && (o = o.slice(0, -1));
            var u = o;
            return a && (u += "/" + encodeURIComponent(a).replace(/%2F/g, "/")),
              s && (u += s),
              t.isLocation && (u = u.replace(/^https?:\/\//, "")),
              u
          }
          function M(t, e) {
            var n = this;
            if (n.options.getAuthorization) n.options.getAuthorization.call(n, {
              Method: t.Method,
              Key: t.Key
            },
              function (t) {
                "string" == typeof t && (t = {
                  Authorization: t
                }),
                  e && e(t)
              });
            else {
              if (!n.options.getSTS) {
                var r = j.getAuth({
                  SecretId: t.SecretId || n.options.SecretId,
                  SecretKey: t.SecretKey || n.options.SecretKey,
                  Method: t.Method,
                  Key: t.Key
                });
                return e && e({
                  Authorization: r
                }),
                  r
              }
              var o = t.Bucket || "";
              n._StsMap = n._StsMap || {};
              var i = n._StsMap[o] || {},
                a = function () {
                  var n = j.getAuth({
                    SecretId: i.SecretId,
                    SecretKey: i.SecretKey,
                    Method: t.Method,
                    Key: t.Key
                  }),
                    r = {
                      Authorization: n,
                      XCosSecurityToken: i.XCosSecurityToken || "",
                      Token: i.Token || "",
                      ClientIP: i.ClientIP || "",
                      ClientUA: i.ClientUA || ""
                    };
                  e && e(r)
                };
              i.ExpiredTime && i.ExpiredTime - (Date.now() / 1e3 > 60) ? a() : n.options.getSTS.call(n, {
                Bucket: o
              },
                function (t) {
                  i = n._StsMap[o] = t || {},
                    a()
                })
            }
            return ""
          }
          function L(t, e) {
            var n = this,
              r = t.action || "post" !== t.method.toLowerCase() ? t.Key : "";
            M.call(n, {
              Method: t.method,
              Key: r
            },
              function (r) {
                t.AuthData = r,
                  U.call(n, t, e)
              })
          }
          function U(t, e) {
            var n = this,
              r = t.TaskId;
            if (!r || n._isRunningTask(r)) {
              var o = t.Bucket,
                i = t.Region,
                a = t.Key,
                s = t.action,
                u = t.method || "GET",
                c = t.headers || {},
                l = t.url,
                f = t.body,
                h = t.filePath,
                d = t.json,
                p = t.rawBody,
                g = t.qs,
                y = {
                  url: l || D({
                    domain: n.options.Domain,
                    bucket: o,
                    region: i,
                    object: a,
                    action: s
                  }),
                  method: u,
                  headers: c || {},
                  filePath: h,
                  qs: g,
                  body: f,
                  json: d
                };
              y.headers.Authorization = t.AuthData.Authorization,
                t.AuthData.Token && (y.headers.token = t.AuthData.Token),
                t.AuthData.ClientIP && (y.headers.clientIP = t.AuthData.ClientIP),
                t.AuthData.ClientUA && (y.headers.clientUA = t.AuthData.ClientUA),
                t.AuthData.XCosSecurityToken && (y.headers["x-cos-security-token"] = t.AuthData.XCosSecurityToken),
                y.headers && (y.headers = j.clearKey(y.headers)),
                y.qs && (y.qs = j.clearKey(y.qs)),
                y = j.clearKey(y),
                t.onProgress && "function" == typeof t.onProgress && (y.onProgress = function (e) {
                  if (!r || n._isRunningTask(r)) {
                    var o = e ? e.loaded : 0;
                    t.onProgress({
                      loaded: o,
                      total: e.total
                    })
                  }
                });
              var v = F(y,
                function (t, o, i) {
                  var a = function (t, i) {
                    r && n.off("inner-kill-task", C),
                      r && !n._isRunningTask(r) || (t ? (t = t || {},
                        o && o.statusCode && (t.statusCode = o.statusCode), o && o.headers && (t.headers = o.headers), e(t, null)) : (i = i || {},
                          o && o.statusCode && (i.statusCode = o.statusCode), o && o.headers && (i.headers = o.headers), e(null, i)))
                  };
                  if (t) return void a({
                    error: t
                  });
                  var s;
                  try {
                    s = j.xml2json(i) || {}
                  } catch (t) {
                    s = i || {}
                  }
                  var u = o.statusCode;
                  return 200 !== u && 204 !== u && 206 !== u ? void a({
                    error: s.Error || s
                  }) : (p && (s = {},
                    s.body = i), s.Error ? void a({
                      error: s.Error
                    }) : void a(null, s))
                }),
                C = function (t) {
                  t.TaskId === r && (v && v.abort && v.abort(), n.off("inner-kill-task", C))
                };
              r && n.on("inner-kill-task", C)
            }
          }
          var j = n(0),
            F = n(15),
            N = {
              getService: r,
              putBucket: a,
              getBucket: i,
              headBucket: o,
              deleteBucket: s,
              getBucketAcl: u,
              putBucketAcl: c,
              getBucketCors: l,
              putBucketCors: f,
              deleteBucketCors: h,
              getBucketLocation: p,
              putBucketTagging: v,
              getBucketTagging: y,
              deleteBucketTagging: C,
              getBucketPolicy: g,
              putBucketPolicy: d,
              getBucketLifecycle: A,
              putBucketLifecycle: m,
              deleteBucketLifecycle: _,
              getObject: w,
              headObject: x,
              putObject: R,
              postObject: B,
              deleteObject: E,
              getObjectAcl: T,
              putObjectAcl: k,
              optionsObject: b,
              putObjectCopy: S,
              getObjectUrl: O,
              getAuth: P
            };
          j.each(N,
            function (t, n) {
              e[n] = j.apiWrapper(n, t)
            })
        }).call(e, n(1).Buffer)
      },
      function (t, e) {
        var n = function (t) {
          var e, n, r, o = [],
            i = Object.keys(t);
          for (e = 0; e < i.length; e++) n = i[e],
            r = t[n] || "",
            o.push(n + "=" + encodeURIComponent(r));
          return o.join("&")
        },
          r = function (t, e) {
            var r, o = t.filePath,
              i = t.headers,
              a = t.url,
              s = t.method,
              u = t.onProgress,
              c = function (t, n) {
                e(t, {
                  statusCode: n.statusCode,
                  headers: n.header
                },
                  n.data)
              };
            if (o) {
              var l = a.match(/^(https?:\/\/[^\/]+\/)(.*)$/),
                f = l[2] || "";
              a = l[1],
                r = wx.uploadFile({
                  url: a,
                  method: s,
                  name: "file",
                  filePath: o,
                  formData: {
                    key: f,
                    success_action_status: 200,
                    Signature: i.Authorization
                  },
                  success: function (t) {
                    c(null, t)
                  },
                  fail: function (t) {
                    c(t.errMsg, t)
                  }
                }),
                r.onProgressUpdate(function (t) {
                  u({
                    loaded: t.totalBytesSent,
                    total: t.totalBytesExpectedToSend,
                    progress: t.progress / 100
                  })
                })
            } else {
              var h = t.qs && n(t.qs) || "";
              h && (a += (a.indexOf("?") > -1 ? "&" : "?") + h),
                wx.request({
                  url: a,
                  method: s,
                  header: i,
                  dataType: "text",
                  data: t.body,
                  success: function (t) {
                    c(null, t)
                  },
                  fail: function (t) {
                    c(t.errMsg, t)
                  }
                })
            }
            return r
          };
        t.exports = r
      }])
    });