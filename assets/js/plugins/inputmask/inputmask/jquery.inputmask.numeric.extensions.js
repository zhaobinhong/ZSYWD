/*
 * jquery.inputmask.numeric.extensions.js
 * http://github.com/RobinHerbots/jquery.inputmask
 * Copyright (c) 2010 - 2014 Robin Herbots
 * Licensed under the MIT license (http://www.opensource.org/licenses/mit-license.php)
 * Version: 3.1.23
 */
!function (a) {
    "function" == typeof define && define.amd ? define(["jquery", "./jquery.inputmask"], a) : a(jQuery)
}(function (a) {
    return a.extend(a.inputmask.defaults.aliases, {
        numeric: {
            mask: function (a) {
                if (0 !== a.repeat && isNaN(a.integerDigits) && (a.integerDigits = a.repeat), a.repeat = 0, a.groupSeparator == a.radixPoint && (a.groupSeparator = "." == a.radixPoint ? "," : "," == a.radixPoint ? "." : ""), " " === a.groupSeparator && (a.skipOptionalPartCharacter = void 0), a.autoGroup = a.autoGroup && "" != a.groupSeparator, a.autoGroup && isFinite(a.integerDigits)) {
                    var b = Math.floor(a.integerDigits / a.groupSize), c = a.integerDigits % a.groupSize;
                    a.integerDigits += 0 == c ? b - 1 : b
                }
                a.definitions[";"] = a.definitions["~"], a.definitions[":"].placeholder = a.radixPoint;
                var d = a.prefix;
                return d += "[+]", d += "~{1," + a.integerDigits + "}", void 0 != a.digits && (isNaN(a.digits) || parseInt(a.digits) > 0) && (d += a.digitsOptional ? "[" + (a.decimalProtect ? ":" : a.radixPoint) + ";{" + a.digits + "}]" : (a.decimalProtect ? ":" : a.radixPoint) + ";{" + a.digits + "}"), d += a.suffix
            },
            placeholder: "",
            greedy: !1,
            digits: "*",
            digitsOptional: !0,
            groupSeparator: "",
            radixPoint: ".",
            groupSize: 3,
            autoGroup: !1,
            allowPlus: !0,
            allowMinus: !0,
            integerDigits: "+",
            prefix: "",
            suffix: "",
            rightAlign: !0,
            decimalProtect: !0,
            postFormat: function (b, c, d, e) {
                var f = !1, g = b[c];
                if ("" == e.groupSeparator || -1 != a.inArray(e.radixPoint, b) && c >= a.inArray(e.radixPoint, b) || new RegExp("[-+]").test(g))return {pos: c};
                var h = b.slice();
                g == e.groupSeparator && (h.splice(c--, 1), g = h[c]), d ? h[c] = "?" : h.splice(c, 0, "?");
                var i = h.join("");
                if (e.autoGroup || d && -1 != i.indexOf(e.groupSeparator)) {
                    var j = a.inputmask.escapeRegex.call(this, e.groupSeparator);
                    f = 0 == i.indexOf(e.groupSeparator), i = i.replace(new RegExp(j, "g"), "");
                    var k = i.split(e.radixPoint);
                    if (i = k[0], i != e.prefix + "?0" && i.length >= e.groupSize + e.prefix.length) {
                        f = !0;
                        for (var l = new RegExp("([-+]?[\\d?]+)([\\d?]{" + e.groupSize + "})"); l.test(i);)i = i.replace(l, "$1" + e.groupSeparator + "$2"), i = i.replace(e.groupSeparator + e.groupSeparator, e.groupSeparator)
                    }
                    k.length > 1 && (i += e.radixPoint + k[1])
                }
                b.length = i.length;
                for (var m = 0, n = i.length; n > m; m++)b[m] = i.charAt(m);
                var o = a.inArray("?", b);
                return d ? b[o] = g : b.splice(o, 1), {pos: o, refreshFromBuffer: f}
            },
            onKeyDown: function (b, c, d, e) {
                if (b.keyCode == e.keyCode.TAB && "0" != e.placeholder.charAt(0)) {
                    var f = a.inArray(e.radixPoint, c);
                    if (-1 != f && isFinite(e.digits)) {
                        for (var g = 1; g <= e.digits; g++)(void 0 == c[f + g] || c[f + g] == e.placeholder.charAt(0)) && (c[f + g] = "0");
                        return {refreshFromBuffer: {start: ++f, end: f + e.digits}}
                    }
                } else if (e.autoGroup && (b.keyCode == e.keyCode.DELETE || b.keyCode == e.keyCode.BACKSPACE)) {
                    var h = e.postFormat(c, d - 1, !0, e);
                    return h.caret = h.pos + 1, h
                }
            },
            onKeyPress: function (a, b, c, d) {
                if (d.autoGroup) {
                    var e = d.postFormat(b, c - 1, !0, d);
                    return e.caret = e.pos + 1, e
                }
            },
            regex: {
                integerPart: function () {
                    return new RegExp("[-+]?\\d+")
                }
            },
            negationhandler: function (a, b, c, d, e) {
                if (!d && e.allowMinus && "-" === a) {
                    var f = b.join("").match(e.regex.integerPart(e));
                    if (f.length > 0)return "+" == b[f.index] ? {
                        pos: f.index,
                        c: "-",
                        remove: f.index,
                        caret: c
                    } : "-" == b[f.index] ? {remove: f.index, caret: c - 1} : {pos: f.index, c: "-", caret: c + 1}
                }
                return !1
            },
            radixhandler: function (b, c, d, e, f) {
                if (!e && b === f.radixPoint) {
                    var g = a.inArray(f.radixPoint, c.buffer.join("")), h = c.buffer.join("").match(f.regex.integerPart(f));
                    if (-1 != g)return c.validPositions[g - 1] ? {caret: g + 1} : {pos: h.index, c: h[0], caret: g + 1}
                }
                return !1
            },
            leadingZeroHandler: function (b, c, d, e, f) {
                var g = c.buffer.join("").match(f.regex.integerPart(f)), h = a.inArray(f.radixPoint, c.buffer);
                if (g && !e && (-1 == h || g.index < h))if (0 == g[0].indexOf("0") && d >= f.prefix.length) {
                    if (-1 == h || h >= d && void 0 == c.validPositions[h])return c.buffer.splice(g.index, 1), d = d > g.index ? d - 1 : g.index, {
                        pos: d,
                        remove: g.index
                    };
                    if (d > g.index && h >= d)return c.buffer.splice(g.index, 1), d = d > g.index ? d - 1 : g.index, {
                        pos: d,
                        remove: g.index
                    }
                } else if ("0" == b && d <= g.index)return !1;
                return !0
            },
            definitions: {
                "~": {
                    validator: function (b, c, d, e, f) {
                        var g = f.negationhandler(b, c.buffer, d, e, f);
                        if (!g && (g = f.radixhandler(b, c, d, e, f), !g && (g = e ? new RegExp("[0-9" + a.inputmask.escapeRegex.call(this, f.groupSeparator) + "]").test(b) : new RegExp("[0-9]").test(b), g === !0 && (g = f.leadingZeroHandler(b, c, d, e, f), g === !0)))) {
                            var h = a.inArray(f.radixPoint, c.buffer);
                            return f.digitsOptional === !1 && d > h && !e ? {pos: d, remove: d} : {pos: d}
                        }
                        return g
                    }, cardinality: 1, prevalidator: null
                }, "+": {
                    validator: function (a, b, c, d, e) {
                        var f = "[";
                        return e.allowMinus === !0 && (f += "-"), e.allowPlus === !0 && (f += "+"), f += "]", new RegExp(f).test(a)
                    }, cardinality: 1, prevalidator: null
                }, ":": {
                    validator: function (b, c, d, e, f) {
                        var g = f.negationhandler(b, c.buffer, d, e, f);
                        if (!g) {
                            var h = "[" + a.inputmask.escapeRegex.call(this, f.radixPoint) + "]";
                            g = new RegExp(h).test(b), g && c.validPositions[d] && c.validPositions[d].match.placeholder == f.radixPoint && (g = {
                                pos: d,
                                remove: d
                            })
                        }
                        return g
                    }, cardinality: 1, prevalidator: null, placeholder: ""
                }
            },
            insertMode: !0,
            autoUnmask: !1,
            onUnMask: function (b, c, d) {
                var e = b.replace(d.prefix, "");
                return e = e.replace(d.suffix, ""), e = e.replace(new RegExp(a.inputmask.escapeRegex.call(this, d.groupSeparator), "g"), "")
            },
            isComplete: function (b, c) {
                var d = b.join(""), e = b.slice();
                if (c.postFormat(e, 0, !0, c), e.join("") != d)return !1;
                var f = d.replace(c.prefix, "");
                return f = f.replace(c.suffix, ""), f = f.replace(new RegExp(a.inputmask.escapeRegex.call(this, c.groupSeparator), "g"), ""), f = f.replace(a.inputmask.escapeRegex.call(this, c.radixPoint), "."), isFinite(f)
            },
            onBeforeMask: function (b, c) {
                if (isFinite(b))return b.toString().replace(".", c.radixPoint);
                var d = b.match(/,/g), e = b.match(/\./g);
                return e && d ? e.length > d.length ? (b = b.replace(/\./g, ""), b = b.replace(",", c.radixPoint)) : d.length > e.length && (b = b.replace(/,/g, ""), b = b.replace(".", c.radixPoint)) : b = b.replace(new RegExp(a.inputmask.escapeRegex.call(this, c.groupSeparator), "g"), ""), b
            }
        },
        currency: {
            prefix: "$ ",
            groupSeparator: ",",
            radixPoint: ".",
            alias: "numeric",
            placeholder: "0",
            autoGroup: !0,
            digits: 2,
            digitsOptional: !1,
            clearMaskOnLostFocus: !1,
            decimalProtect: !0
        },
        decimal: {alias: "numeric"},
        integer: {alias: "numeric", digits: "0"}
    }), a.fn.inputmask
});