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

    if (jQuery) {
        jQuery.fn.extend({
            serializeJSON: function() {
                var json = { },
                    check = function( parent, key, isArray ) {
                        parent[ key ] = parent[ key ] || ( isArray ? [ ] : { } );
                        return parent[ key ];
                    },
                    setValue = function( context, chain, value ) {
                        var pre = context,
                            cur,
                            i,
                            old;
                        for ( i = 0; i < chain.length - 1; i++ ) {
                            cur = check( pre, chain[ i ], jQuery.isNumeric( chain[ i + 1 ] ) );
                            pre = cur;
                        }
                        old = pre[ chain[ chain.length - 1 ] ];
                        if ( old && old.push ) {
                            old.push( value );
                        } else if ( old ) {
                            pre[ chain[ chain.length - 1 ] ] = [ old, value ];
                        } else {
                            pre[ chain[ chain.length - 1 ] ] = value;
                        }
                    },
                    assign = function( context, name, value ) {
                        var namePattern = /\w+/,
                            numPattern = /\d+/,
                            pattern = /\[(\w+)\]/gi,
                            chain = [ ], m, t;
                        if ( m = namePattern.exec( name ) ){
                            chain.push( m[0] );
                            while ( t = pattern.exec( name ) ) {
                                if ( numPattern.test( t[ 1 ] ) ) {
                                    chain.push( +t[ 1 ] );
                                } else {
                                    chain.push( t[ 1 ] );
                                }
                            }
                        }
                        setValue( context, chain, value );
                    };
                jQuery.each( this.serializeArray(), function( i, e ) {
                    if ( e.value ) {
                        assign( json, e.name, e.value );
                    }
                } );
                return json;
            }
        });
    }
}(window.jQuery || jQuery));