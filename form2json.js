/*!
  SerializeJSON jQuery plugin.
  https://github.com/jameszhan/form2json
  version 2.4.1 (Oct, 2014)

  Copyright (c) 2014 James Zhan
  Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
  and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
*/

(function (jQuery) {
    "use strict";

    jQuery.fn.extend({
        serializeJSON: function () {
            var serializedObject = { }, $form = this,
                isObject =  function(obj) {
                    var type = typeof obj;
                    return type === 'function' || type === 'object' && !!obj;
                },
                isUndefined = function( obj ) { return obj === void 0; },
                isValidArrayIndex = function( val ) { return /^[0-9]+$/.test(String(val));},
                valueOf = function (el) {
                    if (el.value === "on" || el.value === "off") {
                        if ( $form.find('input[type=checkbox][name=' + el.name + ']') ) {
                            return el.value === "on";
                        } else {
                            return el.value;
                        }
                    } else {
                        return el.value;
                    }
                },
                doAssign = function ( target, keys, value ) {
                    var key, nextKey, oldValue, lastIndex, lastValue;
                    if (isUndefined(target)) { throw new Error("ArgumentError: param 'target' expected to be an object or array, found undefined"); }
                    if (!keys || keys.length === 0) { throw new Error("ArgumentError: param 'keys' expected to be an array with least one element"); }
                    key = keys[0];
                    if (keys.length === 1) {
                        if (key === '') {
                            target.push(value);
                        } else {
                            oldValue = target[key];
                            if (oldValue && oldValue.push) {
                                oldValue.push(value);
                            } else if (oldValue) {
                                target[key] = [oldValue, value];
                            } else {
                                target[key] = value;
                            }
                        }
                    } else {
                        nextKey = keys[1];
                        if ( key === '' ) {
                            lastIndex = target.length - 1; //target must be an array
                            lastValue = target[lastIndex];
                            if (isObject(lastValue) && (isUndefined(lastValue[nextKey]) || keys.length > 2)) {
                                key = lastIndex;
                            } else {
                                key = lastIndex + 1;
                            }
                        }
                        if ( isUndefined( target[ key ] ) ) {
                            target[key] = (nextKey === '' || isValidArrayIndex( nextKey )) ? [] : {};
                        }
                        doAssign(target[key], keys.slice(1), value);
                    }
                };
            jQuery.each(this.serializeArray(), function (i, e) {
                var keys;
                if (e.value && e.name) {
                    keys = $.map(e.name.split('['), function( key ) { return key.replace(/]/g, ''); });
                    doAssign(serializedObject, keys, valueOf(e));
                }
            });
            return serializedObject;
        },
        serializeJSON2: function () {
            var serializedObject = { }, $form = this, arrayIndexes = {},
                check = function (context, key, isArray) {
                    context[ key ] = context[ key ] || ( isArray ? [] : {} );
                    return context[ key ];
                },
                isUndefined = function( obj ) { return obj === void 0; },
                isValidArrayIndex = function( val ) { return /^[0-9]+$/.test(String(val));},
                valueOf = function (el) {
                    if (el.value === "on" || el.value === "off") {
                        if ( $form.find('input[type=checkbox][name=' + el.name + ']') ) {
                            return el.value === "on";
                        } else {
                            return el.value;
                        }
                    } else {
                        return el.value;
                    }
                },
                assign = function ( context, keys, value ) {
                    var i, key, current = context, old, arrayIndexKey, arrayIndex;
                    for ( i = 0; i < keys.length - 1; i++ ) {
                        key = keys[i];
                        if (key === '' && i < keys.length - 1) { //handle a[][name]
                            arrayIndexKey = keys.slice(0, i).join(",");
                            arrayIndex = arrayIndexes[arrayIndexKey];
                            if (isUndefined(arrayIndexes[arrayIndexKey])) {
                                arrayIndex = arrayIndexes[arrayIndexKey] = 0;
                                current = check(current, arrayIndex, keys[ i + 1 ] === '' || isValidArrayIndex(keys[i + 1]));
                            } else {
                                old = current[arrayIndex];
                                if (isUndefined(old[keys[i + 1]])) {
                                    current = current[arrayIndex];
                                } else {
                                    arrayIndex = arrayIndexes[arrayIndexKey] = arrayIndexes[arrayIndexKey] + 1;
                                    current = check(current, arrayIndex, keys[ i + 1 ] === '' || isValidArrayIndex(keys[i + 1]));
                                }
                            }
                        } else {
                            console.log(key, keys, JSON.stringify(current));
                            current = check(current, key, keys[ i + 1 ] === '' || isValidArrayIndex(keys[i + 1]));
                        }
                    }
                    key = keys[ keys.length - 1 ];
                    console.log("=", keys, "(", key, ")", current, value);
                    if ( key === '' ) {
                        current.push(value);
                    } else {
                        old = current[ key ];
                        if (old && old.push) {
                            old.push(value);
                        } else if (old) {
                            current[ key ] = [ old, value ];
                        } else {
                            current[ key ] = value;
                        }
                    }
                };
            jQuery.each(this.serializeArray(), function (i, e) {
                var keys;
                if (e.value && e.name) {
                    keys = $.map(e.name.split('['), function( key ) { return key.replace(/]/g, ''); });
                    assign(serializedObject, keys, valueOf(e));
                }
            });
            return serializedObject;
        },
        serializeJSON1: function () {
            var serializedObject = { },
                check = function (parent, key, isArray) {
                    parent[ key ] = parent[ key ] || ( isArray ? [ ] : { } );
                    return parent[ key ];
                },
                setValue = function (context, chain, value) {
                    var pre = context,
                        cur,
                        i,
                        old;
                    for (i = 0; i < chain.length - 1; i++) {
                        cur = check(pre, chain[ i ], jQuery.isNumeric(chain[ i + 1 ]));
                        pre = cur;
                    }
                    old = pre[ chain[ chain.length - 1 ] ];
                    if (old && old.push) {
                        old.push(value);
                    } else if (old) {
                        pre[ chain[ chain.length - 1 ] ] = [ old, value ];
                    } else {
                        pre[ chain[ chain.length - 1 ] ] = value;
                    }
                },
                valueOf = function (el) {
                    return el.value === "on" ? true : ( el.value === "off" ? false : el.value );
                },
                assign = function (context, name, value) {
                    var namePattern = /\w+/,
                        numPattern = /\d+/,
                        pattern = /\[(\w+)\]/gi,
                        chain = [ ], m, t;
                    if (m = namePattern.exec(name)) {
                        chain.push(m[0]);
                        while (t = pattern.exec(name)) {
                            if (numPattern.test(t[ 1 ])) {
                                chain.push(+t[ 1 ]);
                            } else {
                                chain.push(t[ 1 ]);
                            }
                        }
                    }
                    setValue(context, chain, value);
                };
            jQuery.each(this.serializeArray(), function (i, e) {
                if (e.value) {
                    assign(serializedObject, e.name, valueOf(e));
                }
            });
            return serializedObject;
        }
    });

}(jQuery));
