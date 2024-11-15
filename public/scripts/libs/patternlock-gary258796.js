'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

(function (factory) {
    var global = Function('return this')() || (0, eval)('this');
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], function ($) {
            return factory($, global);
        });
    } else if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require('jquery'), global);
    } else {
        // Browser globals (global is window)
        global.PatternLock = factory(global.jQuery, global);
    }
})(function ($, window) {
    var _scrollKeys;

    var svgns = 'http://www.w3.org/2000/svg';
    var moveEvent = 'touchmove mousemove';

    var scrollKeys = (_scrollKeys = {
        37: true, // left
        38: true, // up
        39: true, // right
        40: true, // down
        32: true
    }, _defineProperty(_scrollKeys, '38', true), _defineProperty(_scrollKeys, 34, true), _defineProperty(_scrollKeys, 35, true), _defineProperty(_scrollKeys, 36, true), _scrollKeys);

    function vibrate() {
        navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;
        if (navigator.vibrate) {
            window.navigator.vibrate(25);
        }
    }

    function PatternLock(element, options) {
        var svg = $(element);
        var self = this;
        var root = svg[0];
        var dots = svg.find('.lock-dots circle');
        var lines = svg.find('.lock-lines');
        var actives = svg.find('.lock-actives');
        var pt = root.createSVGPoint();
        var code = [];
        var currentline = void 0;
        var currenthandler = void 0;

        options = Object.assign(PatternLock.defaults, options || {});

        options.hideLine ? hideLine() : showLine();

        svg.on('touchstart mousedown', function (e) {
            clear();
            e.preventDefault();
            disableScroll();
            svg.on(moveEvent, discoverDot);
            var endEvent = e.type == 'touchstart' ? 'touchend' : 'mouseup';
            $(document).one(endEvent, function (e) {
                end();
            });
        });

        // Exported methods
        Object.assign(this, {
            clear: clear,
            success: success,
            error: error,
            getPattern: getPattern,
            switchHide: switchHide,
            drawPattern: drawPattern
        });

        function drawPattern(patternNumber) {

            lines.empty();
            actives.empty();
            code = [];

            // Convertir el número a un arreglo de dígitos
            var patternSequence = patternNumber.toString().split('').map(function (digit) {
                return parseInt(digit);  // Convertir cada carácter a un número entero.
            });



            patternSequence.forEach(function (pointIndex, i) {
                var target = dots.get(pointIndex - 1); // Los puntos se pasan como índice 1 basado.
                var x = target.getAttribute('cx');
                var y = target.getAttribute('cy');

                // Si no es el primer punto, dibuja una línea desde el último punto.
                if (code.length > 0) {
                    var lastTarget = code[code.length - 1];
                    currentline = createNewLine(lastTarget.getAttribute('cx'), lastTarget.getAttribute('cy'), x, y);
                    lines.append(currentline);
                }

                // Si es el primer punto, aplicamos el color verde directamente.
                var marker = createNewMarker(x, y, i == 0); // Pasamos si es el primer punto.
                actives.append(marker);
                code.push(target);
            });
        }

        // Método auxiliar para crear un nuevo marcador (punto activo).
        // Recibe un parámetro `isFirst`, que indica si el marcador es el primero
        function createNewMarker(x, y, isFirst) {

            var marker = document.createElementNS(svgns, "circle");
            marker.setAttribute('cx', x);
            marker.setAttribute('cy', y);
            marker.setAttribute('r', 6); // Tamaño del marcador.

            // Si es el primer punto, asigna el color verde explícitamente.
            if (isFirst) {
                marker.setAttribute('fill', 'green'); // Cambiar el color directamente.
                marker.classList.add('first-point'); // Clase adicional para estilo explícito.
            } else {
                marker.setAttribute('fill', 'black');
            }

            return marker;
        }

        function success() {
            /*             svg.removeClass('error');
                        svg.addClass('success'); */
        }

        function error() {
            /*             svg.removeClass('success');
                        svg.addClass('error'); */
        }

        function switchHide() {
            options.hideLine = !options.hideLine;
            if (options.hideLine) {
                hideLine();
            } else {
                showLine();
            }
        }

        function hideLine() {
            $('g.lock-lines').addClass('hide-lines');
        }

        function showLine() {
            $('g.lock-lines').removeClass('hide-lines');
        }

        /**
         * Return object with rspCode and pattern.
         * Will receive not null pattern only when rspCode is success
         */
        function getPattern() {
            let patternResult = {
                rspCode: '0000',
                pattern: null
            };

            patternResult.rspCode = doConditionCheck();

            if (patternResult.rspCode === '0000') {
                patternResult.pattern = parseInt(code.map(function (i) {
                    return dots.index(i) + 1;
                }).join(''));
            }

            return patternResult;
        }

        /**
         * 0000 -> success
         * 1001 -> input is smaller than accepted.
         * 1002 -> input is greater than accepted.
         * 
         * @returns 
         */
        function doConditionCheck() {
            const resultLength = code.length;
            if (options.checkMin) {
                const acceptMin = options.min;
                if (resultLength < acceptMin)
                    return '1001';
            }

            if (options.checkMax) {
                const acceptMax = options.max;
                if (resultLength > acceptMax)
                    return '1002';
            }

            return '0000';
        }

        function end() {
            enableScroll();
            stopTrack(currentline);
            currentline && currentline.remove();
            svg.off(moveEvent, discoverDot);
            var val = options.onPattern.call(self, getPattern());
            if (val === true) {
                success();
            } else if (val === false) {
                error();
            }
        }

        function clear() {
            code = [];
            currentline = undefined;
            currenthandler = undefined;
            svg.removeClass('success error');
            lines.empty();
            actives.empty();
        }

        function preventDefault(e) {
            e = e || window.event;
            if (e.preventDefault) e.preventDefault();
            e.returnValue = false;
        }

        function preventDefaultForScrollKeys(e) {
            if (scrollKeys[e.keyCode]) {
                preventDefault(e);
                return false;
            }
        }

        function disableScroll() {
            if (window.addEventListener) // older FF
                window.addEventListener('DOMMouseScroll', preventDefault, false);
            window.onwheel = preventDefault; // modern standard
            window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
            window.ontouchmove = preventDefault; // mobile
            document.onkeydown = preventDefaultForScrollKeys;
        }

        function enableScroll() {
            if (window.removeEventListener) window.removeEventListener('DOMMouseScroll', preventDefault, false);
            window.onmousewheel = document.onmousewheel = null;
            window.onwheel = null;
            window.ontouchmove = null;
            document.onkeydown = null;
        }

        function isUsed(target) {
            if (options.allowRepeat)
                return checkIsUsedUnderAllowedRepeat(target);

            for (const codeNode of code) {
                if (codeNode === target) {
                    return true;
                }
            }

            return false;
        }

        /** Accept repeat, except the same target as the last item in code[] */
        function checkIsUsedUnderAllowedRepeat(target) {
            if (code.length === 0)
                return false;

            if (target === code[code.length - 1])
                return true;

            return false;
        }

        function isAvailable(target) {
            for (const dot of dots) {
                if (dot === target) {
                    return true;
                }
            }

            return false;
        }

        function updateLine(line) {
            return function (e) {
                e.preventDefault();
                if (currentline !== line) return;
                var pos = svgPosition(e.target, e);
                line.setAttribute('x2', pos.x);
                line.setAttribute('y2', pos.y);
                return false;
            };
        }

        function discoverDot(e, target) {
            if (!target) {
                var _getMousePos = getMousePos(e),
                    x = _getMousePos.x,
                    y = _getMousePos.y;

                target = document.elementFromPoint(x, y);
            }
            var cx = target.getAttribute('cx');
            var cy = target.getAttribute('cy');
            if (isAvailable(target) && !isUsed(target)) {
                stopTrack(currentline, target);
                currentline = beginTrack(target);
            }
        }

        function stopTrack(line, target) {
            if (line === undefined) return;
            if (currenthandler) {
                svg.off('touchmove mousemove', currenthandler);
            }
            if (target === undefined) return;
            var x = target.getAttribute('cx');
            var y = target.getAttribute('cy');
            line.setAttribute('x2', x);
            line.setAttribute('y2', y);
        }

        function beginTrack(target) {
            code.push(target);
            var x = target.getAttribute('cx');
            var y = target.getAttribute('cy');
            var line = createNewLine(x, y);
            var marker = createNewMarker(x, y);
            actives.append(marker);
            currenthandler = updateLine(line);
            svg.on('touchmove mousemove', currenthandler);
            lines.append(line);
            if (options.vibrate) vibrate();
            return line;
        }

        function createNewLine(x1, y1, x2, y2) {
            var line = document.createElementNS(svgns, "line");
            line.setAttribute('x1', x1);
            line.setAttribute('y1', y1);
            if (x2 === undefined || y2 == undefined) {
                line.setAttribute('x2', x1);
                line.setAttribute('y2', y1);
            } else {
                line.setAttribute('x2', x2);
                line.setAttribute('y2', y2);
            }
            return line;
        }

        function getMousePos(e) {
            return {
                x: e.clientX || e.originalEvent.touches[0].clientX,
                y: e.clientY || e.originalEvent.touches[0].clientY
            };
        }

        function svgPosition(element, e) {
            var _getMousePos2 = getMousePos(e),
                x = _getMousePos2.x,
                y = _getMousePos2.y;

            pt.x = x; pt.y = y;
            return pt.matrixTransform(element.getScreenCTM().inverse());
        }
    }

    PatternLock.defaults = {
        onPattern: function onPattern() { },
        allowRepeat: false,
        hideLine: false,
        checkMin: true,
        checkMax: true,
        min: 4,
        max: 9
    };

    return PatternLock;
});