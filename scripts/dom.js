String.prototype.uconlyfirst = function()
{
    return this.charAt(0).toUpperCase() + this.slice(1);
}
if( typeof Array.prototype.find == 'undefined' )
{
        Object.defineProperty(Array.prototype, 'find',
        {
            value: function(predicate)
            {
                if (this == null) { throw new TypeError('"this" is null or not defined'); }
                var o = Object(this);
                var len = o.length >>> 0;
                if (typeof predicate !== 'function') { throw new TypeError('predicate must be a function'); }
                var thisArg = arguments[1];
                var k = 0;
                while (k < len)
                {
                    var kValue = o[k];
                    if (predicate.call(thisArg, kValue, k, o)) { return kValue; }
                    k++;
                }
                return undefined;
            }
        });
}

function isArray( obj )
{
    try
    {
        return ( Object.prototype.toString.call( obj ) === '[object Array]' || Object.prototype.toString.call( obj ) === '[object NodeList]' );
    }
    catch( error )
    {
        return false;
    }
}

if( !Array.isArray ){ Array.isArray = function(arg) { return Object.prototype.toString.call(arg) === '[object Array]'; }; }

function DOM( element )
{
    if( typeof(element) == 'string' )
    {
        if( element.match(new RegExp('^\\s*<')) )
        {
            element = element.replace(/^\s+|\s+$/g,'');

            var placeholder = document.createElement('div');
            placeholder.innerHTML = element;

            element = placeholder.childNodes;
        }
        else
        {
            element = document.querySelectorAll(element);
        }

        if( typeof element.length != 'undefined' && element.length == 1 )
        {
            element = element[0];
        }
    }

    return element;
}

var DOM_Node = ( typeof Node != 'undefined' ) ? Node : Element;
var DOM_NodeList = ( typeof StaticNodeList != 'undefined' ) ? StaticNodeList : NodeList;

function DOM_ready( callback )
{
    ( document.addEventListener ) ? document.addEventListener( 'DOMContentLoaded', callback, false ) : document.attachEvent('onreadystatechange', callback);
}

function DOM_execute( node )
{
    if( node && typeof node.tagName != 'undefined' && node.tagName.toLowerCase() == 'script' )
    {
        var new_script = document.createElement('script');
        new_script.type = 'text/javascript';
        new_script.id = node.id;
        new_script.text = node.text;
		if( node.src ) { new_script.src = node.src; }

        node.parentNode.insertBefore(new_script, node);
        node.parentNode.removeChild(node);
    }
    else if( node && node.getElementsByTagName )
    {
        var scripts = node.getElementsByTagName('script');
        for( var i = 0; i < scripts.length; ++i )
        {
            var new_script = document.createElement('script');
            new_script.type = 'text/javascript';
            new_script.id = scripts[i].id;
            new_script.text = scripts[i].text;
			if( scripts[i].src ) { new_script.src = scripts[i].src; }

            scripts[i].parentNode.insertBefore(new_script, scripts[i]);
            scripts[i].parentNode.removeChild(scripts[i]);
        }
    }
}

function DOM_selector( selector )
{
    var id 		= selector.match(/#[^#\. ]+/g);
    var classes	= selector.match(/\.[^#\. ]+/g); if( !classes ){ classes = []; }
    var tag 	= selector.match(/ [^#\. ]+/g); if( selector.match(/^[^#\. ]+/g) ){ if( tag ){ tag.concat(selector.match(/^[^#\. ]+/g)); } else { tag = selector.match(/^[^#\. ]+/g); }  }

    if( id && id.length > 1 ){ this.log('ERROR @ .DOM_selector: multiple ids'); }
    else if( id ){ id = ( id.length > 0 ) ? id[0].substr(1) : null;	}

    if( tag && tag.length > 1 ){ this.log('ERROR @ .DOM_selector: multiple tags'); }
    else if( tag ){ tag = ( tag.length > 0 ) ? tag[0].replace(' ','') : null; }

    for( var i = 0; i < classes.length; i++ ){ classes[i] = classes[i].substr(1); }

    this.match = function( element )
    {
        var matching = true;

        if( !element || element == document ) return false;

        if( id )
        {
            if( element.id != id ) return false;
        }
        if( tag )
        {
            if( element.tagName != tag.toUpperCase() ) return false;
        }
        for( var i = 0; i < classes.length; i++ )
        {
            if( !element.hasClass(classes[i]) ){ matching = false; break; }
        }

        return matching;
    }
};

$All = function( selector, node )
{
    if( typeof node == 'undefined' ){ node = document; }

    return node.querySelectorAll( selector );
};

$Node = function( selector, node )
{
    if( typeof node == 'undefined' ){ node = document; }

    return node.querySelector( selector );
};

DOM_Node.prototype.DOM_matchesSelector = function( selector )
{
    if( typeof this.webkitMatchesSelector != 'undefined' )
    {
        return this.webkitMatchesSelector( selector );
    }
    else if( typeof this.mozMatchesSelector != 'undefined' )
    {
        return this.mozMatchesSelector( selector );
    }
    else if( typeof this.msMatchesSelector != 'undefined' )
    {
        return this.msMatchesSelector( selector );
    }
    else if( typeof this.matchesSelector != 'undefined' )
    {
        return this.matchesSelector( selector );
    }
    else
    {
        var selector = new DOM_selector(selector);
        return selector.match(this);
    }

    return false;
};

DOM_Node.prototype.objectFriendlyID = function( prefix )
{
    var id = this.getAttribute( 'data-objectFriendlyID' );
    if( id )
    {
        return id;
    }
    else
    {
        id = prefix + '_';

        var windowElement = this;
        do{ windowElement = windowElement.parentNode; }while( windowElement && ( windowElement.hasClass('Windows' ) ) );

        if( windowElement ){ id += windowElement.firstChild.id + '_'; }
        for( var i = 0; i < 10; i++ ){ id += Math.floor(Math.random() * 10).toString(); }

        this.setAttribute( 'data-objectFriendlyID', id );
        return id;
    }
};

DOM_NodeList.prototype.setAttribute = function( attribute, value )
{
    for( var i = 0; i < this.length; ++i )
    {
        this[i].setAttribute( attribute, value );
    }

    return this;
};

DOM_NodeList.prototype.removeAttribute = function( attribute )
{
    for( var i = 0; i < this.length; ++i )
    {
        this[i].removeAttribute( attribute );
    }

    return this;
};

DOM_Node.prototype.hasClass = function( clazz )
{
    if( typeof this.className == 'undefined' && !this.className ) return false;

    return ( this.className.match(new RegExp('(\\s|^)'+clazz+'(\\s|$)')) != null );
};

DOM_Node.prototype.addClass = function( clazz )
{
    if( typeof clazz == 'string' )
    {
        if( !this.hasClass( clazz ) )
        {
            this.className = ( ( this.className && this.className != '' ) ? this.className + ' ' : '' ) + clazz;
        }
    }
    else
    {
        for( var i = 0; i < clazz.length; ++i )
        {
            if( !this.hasClass( clazz[i] ) )
            {
                this.className = ( ( this.className && this.className != '' ) ? this.className + ' ' : '' ) + clazz[i];
            }
        }
    }

    return this;
};

if( typeof DOM_NodeList.prototype.forEach == 'undefined' )
{
	DOM_NodeList.prototype.forEach = Array.prototype.forEach;
}

DOM_NodeList.prototype.addClass = function( clazz )
{
    var list = []; for( var i = this.length; i--; list.unshift(this[i]) );

    for( var i = 0; i < list.length; ++i )
    {
        list[i].addClass( clazz );
    }

    return this;
};

DOM_Node.prototype.removeClass = function( clazz )
{
    if( typeof clazz == 'string' )
    {
        if( this.hasClass( clazz ) )
        {
            this.className = this.className.replace(clazz,'').replace(/^\s\s*/, '').replace(/\s\s*$/, '').replace(/[ ]+/,' ');
        }
    }
    else
    {
        for( var i = 0; i < clazz.length; ++i )
        {
            if( this.hasClass( clazz[i] ) )
            {
                this.className = this.className.replace(clazz[i],'').replace(/^\s\s*/, '').replace(/\s\s*$/, '').replace(/[ ]+/,' ');
            }
        }
    }

    return this;
};

DOM_NodeList.prototype.removeClass = function( clazz )
{
    var list = []; for( var i = this.length; i--; list.unshift(this[i]) );

    for( var i = 0; i < list.length; ++i )
    {
        list[i].removeClass( clazz );
    }

    return this;
};

DOM_Node.prototype.toggleClass = function( clazz )
{
    if( typeof clazz == 'string' )
    {
        if( this.hasClass( clazz ) )
        {
            this.removeClass( clazz );
        }
        else
        {
            this.addClass( clazz );
        }
    }
    else
    {
        for( var i = 0; i < clazz.length; ++i )
        {
            if( this.hasClass( clazz[i] ) )
            {
                this.removeClass( clazz[i] );
            }
            else
            {
                this.addClass( clazz[i] );
            }
        }
    }

    return this;
};

DOM_NodeList.prototype.toggleClass = function( clazz )
{
    var list = []; for( var i = this.length; i--; list.unshift(this[i]) );

    for( var i = 0; i < list.length; ++i )
    {
        list[i].toggleClass( clazz );
    }

    return this;
};

DOM_Node.prototype.styles = function( styles )
{
    if( typeof styles == 'string' )
    {
        if( this.style[attribute] && typeof this.style[attribute] != 'undefined' )
        {
            return this.style[attribute];
        }

        var style = ( typeof this.currentStyle != 'undefined' ) ? this.currentStyle : window.getComputedStyle(this);

        return style[attribute];
    }
    else
    {
        for( var attribute in styles )
        {
            this.style[attribute] = styles[attribute];
        }

        return this;
    }
};

DOM_NodeList.prototype.styles = function( styles )
{
    for( var i = 0; i < this.length; ++i )
    {
        this[i].styles( styles );
    }

    return this;
};

DOM_Node.prototype.parentSelector = function( selector )
{
    var currentElement = this.parentNode;

    while( currentElement != undefined && currentElement != null )
    {
        if( currentElement.DOM_matchesSelector(selector) )
        {
            return currentElement;
        }

        currentElement = currentElement.parentNode;
    }

    return null;
};

DOM_Node.prototype.childrenSelector = function( selector )
{
    var children = new Array();
    var nodes = this.childNodes;

    for( var i = 0; i < nodes.length; ++i )
    {
        if( nodes[i].DOM_matchesSelector( selector ) )
        {
            children.push( nodes[i] );
        }
    }

    return children;
};

DOM_Node.prototype.siblings = function()
{
    var siblings = new Array();
    var nodes = this.parentNode.childNodes;

    for( var i = 0; i < nodes.length; i++ )
    {
        if( nodes[i] != this )
        {
            siblings.push( nodes[i] );
        }
    }

    return siblings;
};

DOM_Node.prototype.replaceWith = function( node )
{
    this.parentNode.replaceChild( node, this );

    return this;
};

DOM_Node.prototype.replaceNode = function( node )
{
    node.parentNode.replaceChild( this, node );
    DOM_execute(this);

    return this;
};

DOM_NodeList.prototype.replaceNode = function( node )
{
    var list = []; for( var i = this.length; i--; list.unshift(this[i]) );

    for( var i = 0; i < list.length; ++i )
    {
        node.parentNode.insertBefore(list[i], node);
        DOM_execute(list[i]);
    }
    node.remove();

    return this;
};

DOM_Node.prototype.prependTo = function( parent, execute )
{
    if( typeof parent == 'string' ){ parent = document.querySelector(parent); }

    if( parent.firstChild )
    {
        parent.insertBefore( this, parent.firstChild );
    }
    else
    {
        parent.appendChild( this );
    }
    if( execute !== false ) DOM_execute( this );

    return this;
};

DOM_NodeList.prototype.prependTo = function( parent, execute )
{
    if( typeof parent == 'string' ){ parent = document.querySelector(parent); }

    //var list = []; for( var i = this.length; i--; list.unshift(this[i]) );
    var list = []; for( var i = this.length; i--; list.push(this[i]) );
    var nodeList = [];

    for( var i = 0; i < list.length; ++i )
    {
        nodeList.unshift(list[i]);

        if( parent.firstChild != null )
        {
            parent.insertBefore( list[i], parent.firstChild );
        }
        else
        {
            parent.appendChild(list[i]);
        }
        if( execute === true ) DOM_execute(list[i]);
    }

    return nodeList;
};

DOM_Node.prototype.appendTo = function( parent, execute )
{
    if( typeof parent == 'string' ){ parent = document.querySelector(parent); }

    parent.appendChild( this );
    if( execute === true ) DOM_execute( this );

    return this;
};

DOM_NodeList.prototype.appendTo = function( parent, execute )
{
    if( typeof parent == 'string' ){ parent = document.querySelector(parent); }

    var list = []; for(var i = this.length; i--; list.unshift(this[i]));

    for( var i = 0; i < list.length; ++i )
    {
        list[i].appendTo( parent, execute );
    }

    return this;
};

//TODO
DOM_Node.prototype._insertBefore = function( sibling, execute )
{
    sibling.parentNode.insertBefore( this, sibling );
    if( execute === true ) DOM_execute( this );

    return this;
};

DOM_NodeList.prototype.insertBefore = function( sibling, execute )
{
    var list = []; for(var i = this.length; i--; list.unshift(this[i]));

    for( var i = 0; i < list.length; ++i )
    {
        list[i]._insertBefore( sibling, execute );
    }

    return this;
};

DOM_Node.prototype.insertAfter = function( sibling, execute )
{
    if( sibling.nextSibling )
    {
        sibling.parentNode.insertBefore( this, sibling.nextSibling );
        if( execute === true ) DOM_execute( this );
    }
    else
    {
        sibling.parentNode.appendChild( this );
        if( execute === true ) DOM_execute( this );
    }

    return this;
};

DOM_NodeList.prototype.insertAfter = function( sibling, execute )
{
    var list = []; for(var i = this.length; i--; list.unshift(this[i]));

    for( var i = 0; i < list.length; ++i )
    {
        list[i].insertAfter( sibling, execute );
    }

    return this;
};

DOM_Node.prototype.remove = function()
{
    if( this.parentNode )
    {
        this.parentNode.removeChild( this );
    }

    return this;
};

DOM_NodeList.prototype.remove = function()
{
    var list = []; for(var i = this.length; i--; list.unshift(this[i]));

    for( var i = 0; i < list.length; ++i )
    {
        list[i].remove();
    }

    return this;
};

DOM_Node.prototype.html = function( html, execute )
{
    this.innerHTML = html;
    if( execute === true ) DOM_execute( this );

    return this;
};

DOM_NodeList.prototype.html = function( html, execute )
{
    for( var i = 0; i < this.length; ++i )
    {
        this[i].html( html, execute );
    }

    return this;
};

DOM_Node.prototype.viewportPosition = function()
{
    var position = { x : 0, y : 0 };

    if (this.offsetParent)
    {
        var currentElement = this;
        do
        {
            position.x += currentElement.offsetLeft - currentElement.scrollLeft;
            position.y += currentElement.offsetTop - currentElement.scrollTop;
        }
        while( currentElement = currentElement.offsetParent );
    }

    return position;
};

DOM_Node.prototype.parentPosition = function( parent )
{
    var position = { x : 0, y : 0 };

    if (this.offsetParent)
    {
        var currentElement = this;
        do
        {
            position.x += currentElement.offsetLeft - currentElement.scrollLeft;
            position.y += currentElement.offsetTop - currentElement.scrollTop;
        }
        while( ( currentElement = currentElement.offsetParent ) && ( currentElement != parent ) );
    }

    return position;
};

/* STATIC FUNCTIONS */

function autogrow( element, padding, maxHeight )
{
    if( typeof padding == 'undefined' )
    {
        if( !element.hasAttribute('data-autogrow-padding') )
        {
            padding = parseInt( window.getComputedStyle(element, null).getPropertyValue('padding-top') ) + parseInt( window.getComputedStyle(element, null).getPropertyValue('padding-bottom') ) + parseInt( window.getComputedStyle(element, null).getPropertyValue('border-top-width') ) + parseInt( window.getComputedStyle(element, null).getPropertyValue('border-bottom-width') );
            element.setAttribute('data-autogrow-padding',padding);
        }
        else
        {
            padding = parseInt( element.getAttribute('data-autogrow-padding') );
        }
    }

    if( element.clientHeight < element.scrollHeight )
    {
        if( !element.hasAttribute('data-autogrow-default-height') )
        {
            element.setAttribute('data-autogrow-default-height',window.getComputedStyle(element, null).getPropertyValue('height'));
        }

        element.style.height = ( element.scrollHeight + ( typeof padding != 'undefined' ? padding : 0 ) ) + 'px';
        element.setAttribute('data-autogrow-length', element.value.length);
    }
    else if( element.hasAttribute('data-autogrow-length') && element.value.length < parseInt( element.getAttribute('data-autogrow-length') ) )
    {
        element.style.height = element.getAttribute('data-autogrow-default-height');
        element.setAttribute('data-autogrow-length', element.value.length);

        autogrow( element, padding );
    }

    if(typeof maxHeight !== "undefined" && parseInt(element.style.height) >= maxHeight){
        element.style.height = maxHeight + 'px';
        return;
    }
}

function DOM_stopPropagation( event )
{
    event = ( event ) ? event : window.event;

    if( event.preventDefault){ event.preventDefault(); } else { window.event.returnValue = false; }

    if( 'bubbles' in event ) // all browsers except IE before version 9
    {
        if( event.bubbles ) event.stopPropagation();
    }
    else event.cancelBubble = true; // Internet Explorer before version 9
}

function DOM_appendAndExecute( element, html )
{
    var placeholder = document.createElement('div');
    placeholder.innerHTML = html;
    while( placeholder.firstChild )
    {
        var elementPointer = placeholder.firstChild;
        element.appendChild( placeholder.firstChild );
        DOM_execute( elementPointer );
    }
}

function DOM_event( event )
{
    var event = ( event ) ? event : window.event;
    var target = ( event.currentTarget ) ? event.currentTarget : ( event.target ? event.target : ( event.srcElement ? event.srcElement : event.originalTarget ) );
    //console.log( target.innerHTML);
    var targetPosition = target.viewportPosition();

    //alert(event.toSource());
    //alert(event.target);

    event.AZtarget = target;
    event.originalTarget = event.srcElement || event.originalTarget;
    event.targetX = targetPosition.x;
    event.targetY = targetPosition.y;
    event.eventTargetX = event.clientX - targetPosition.x;
    event.eventTargetY = event.clientY - targetPosition.y;

    return event;
}

function DOM_deselect()
{
    try
    {
        document.selection.empty();
        window.getSelection().removeAllRanges();
    }
    catch(err)
    {
        window.getSelection().removeAllRanges();
    }
}

function DOM_windowSize()
{
    if (typeof document.clientWidth == "number")
    {
        return { width: document.clientWidth, height: document.clientHeight };
    }
    if (document.compatMode=='CSS1Compat' && document.documentElement && document.documentElement.offsetWidth )
    {
        return { width: document.documentElement.offsetWidth, height: document.documentElement.offsetHeight };
    }
    if (window.innerWidth && window.innerHeight)
    {
        return { width: window.innerWidth, height: window.innerHeight };
    }
    if (document.body && document.body.offsetWidth)
    {
        return { width: document.body.offsetWidth, height: document.body.offsetHeight };
    }
}

function DOM_htmlspecialchars(str){
    if(typeof(str) == "string"){
        str = str.replace(/&/g, "&amp;");
        str = str.replace(/"/g, "&quot;");
        str = str.replace(/'/g, "&#039;");
        str = str.replace(/</g, "&lt;");
        str = str.replace(/>/g, "&gt;");
    }
    return str;
}

function DOM_createMultilangRegexes(string)
{
    var chars = { 'a' : '[aAÃ¡Ã¢Ã¤ÃÃ„Å•aaÄ¹Äº]','A' : '[aAÃ¡Ã¢Ã¤ÃÃ„Å•aaÄ¹Äº]','b' : '[bB]','B' : '[bB]','c' : '[cCcCcCÃ§]','C' : '[cCcCcCÃ§]','d' : '[dDdD]','D' : '[dDdD]','e' : '[eEÃ©eÃ«Ã‰EÃ‹ÄÄ™e]','E' : '[eEÃ©eÃ«Ã‰EÃ‹ÄÄ™e]','f' : '[fF]','F' : '[fF]','g' : '[gG]','G' : '[gG]','h' : '[hH]','H' : '[hH]','i' : '[iIÃ­ÃÃ®]','I' : '[iIÃ­ÃÃ®]','j' : '[jJ]','J' : '[jJ]','k' : '[kK]','K' : '[kK]','l' : '[lLlLLl]','L' : '[lLlLLl]','m' : '[mM]','M' : '[mM]','n' : '[nNnNn]','N' : '[nNnNn]','o' : '[oOÃ´Ã³Ã¶Ã“Ã–Ã”ooOÅˆÅ‘ÅÅ™Å˜]','O' : '[oOÃ´Ã³Ã¶Ã“Ã–Ã”ooOÅˆÅ‘ÅÅ™Å˜]','p' : '[pP]','P' : '[pP]','q' : '[qQ]','Q' : '[qQ]','r' : '[rRrrRR]','R' : '[rRrrRR]','s' : '[sSÅ¡Å sSsS]','S' : '[sSÅ¡Å sSsS]','t' : '[tTtTt]','T' : '[tTtTt]','u' : '[uUÃºuÃ¼ÃšUÃœÃšÃ¼uÅ±]','U' : '[uUÃºuÃ¼ÃšUÃœÃšÃ¼uÅ±]','v' : '[vV]','V' : '[vV]','w' : '[wW]','W' : '[wW]','x' : '[xX]','X' : '[xX]','y' : '[yYÃ½Ã]','Y' : '[yYÃ½Ã]','z' : '[zZÅ¾Å½zZzZz]','Z' : '[zZÅ¾Å½zZzZz]','Ã¡' : '[Ã¡ÃaA]','Ã¢' : '[Ã¢Ã‚aA]','Ã¤' : '[Ã¤Ã„aA]','c' : '[cCcC]','d' : '[dDdD]','Ã©' : '[Ã©Ã‰eE]','e' : '[eEeE]','Ã«' : '[Ã«Ã‹eE]','Ã­' : '[Ã­ÃiI]','l' : '[lLlL]','n' : '[nNnN]','Ã´' : '[Ã´Ã”oO]','Ã³' : '[Ã³Ã“oO]','Ã¶' : '[Ã¶Ã–oO]','r' : '[rRrR]','r' : '[rRrR]','Å¡' : '[Å¡Å sS]','t' : '[tTtT]','Ãº' : '[ÃºÃšuU]','u' : '[uUuU]','Ã¼' : '[Ã¼ÃœÃ¼ÃœuU]','Ã½' : '[Ã½ÃyY]','Å¾' : '[Å¾Å½zZ]','Ã' : '[Ã¡ÃaA]','Ã„' : '[Ã¤Ã„aA]','C' : '[cCcC]','D' : '[dDdD]','Ã‰' : '[Ã©Ã‰eE]','E' : '[eEeE]','Ã‹' : '[Ã«Ã‹eE]','Ã' : '[Ã­ÃiI]','L' : '[lLlL]','N' : '[nNnN]','Ã“' : '[Ã³Ã“oO]','Ã–' : '[Ã¶Ã–oO]','Ã”' : '[Ã´Ã”oO]','R' : '[rRrR]','R' : '[rRrR]','Å ' : '[Å¡Å sS]','T' : '[tTtT]','Ãš' : '[ÃºÃšuU]','U' : '[uUuU]','Ãœ' : '[Ã¼ÃœuU]','Ã' : '[Ã½ÃyY]','Å½' : '[Å¾Å½zZ]','o' : '[oOoO]','O' : '[oOoO]','u' : '[uUuU]','Ä' : '[ÄÄŒeE]','Ä™' : '[Ä™Ä˜eE]','Å•' : '[Å•Å”aA]','Å±' : '[Å±Å°uU]','s' : '[sSsS]','a' : '[aAaA]','S' : '[sSsS]','e' : '[eEeE]','n' : '[nNnN]','L' : '[lLlL]','l' : '[lLlL]','z' : '[zZzZ]','Z' : '[zZzZ]','z' : '[zZzZ]','c' : '[cCcC]','C' : '[cCcC]','Z' : '[zZzZ]','Ã§' : '[Ã§Ã‡cC]','Åˆ' : '[ÅˆÅ‡oO]','Ã®' : '[Ã®ÃŽiI]','a' : '[aAaA]','s' : '[sSsS]','t' : '[tTtT]','S' : '[sSsS]','Å‘' : '[Å‘ÅoO]','Å' : '[Å‘ÅoO]','Ä¹' : '[ÄºÄ¹aA]','Äº' : '[ÄºÄ¹aA]','Å™' : '[Å™Å˜oO]','Å˜' : '[Å™Å˜oO]'};
    var special_chars = { '/' : '\\/','\\' : '\\\\' };
    var regexes = [];
    var word_regex = '';

    for(var i = 0; i < string.length; ++i)
    {
        if( string[i] == ' ' )
        {
            if( word_regex != '' ){ regexes.push(new RegExp(word_regex, 'g')); }
            word_regex = '';
        }
        else if( typeof chars[string[i]] != 'undefined' )
        {
            word_regex += chars[string[i]];
        }
        else if( typeof special_chars[string[i]] != 'undefined' )
        {
            word_regex += special_chars[string[i]];
        }
        else
        {
            word_regex += string[i];
        }
    }
    if( word_regex != '' ){ regexes.push(new RegExp(word_regex, 'g')); }

    return regexes;
}

function DOM_multilangRegexesTest(string, regexes)
{
    for( var i = 0; i < regexes.length; ++i )
    {
        if( !regexes[i].test( string ) ){ return false; }
    }

    return true;
}

function DOM_insertAndExecute( element, html )
{
    element.innerHTML = html;
    DOM_execute( element );
}

function DOM_isTopWindow()
{
    return !( window.top.document != document );
}

function DOM_isVisibleElement( element )
{
	var currentElement = element.parentNode;

	while( currentElement != undefined && currentElement != null )
	{
		if( currentElement.DOM_matchesSelector('body') ){ return true; break }
		if( isHidden( currentElement ) ){ return false; break }

		currentElement = currentElement.parentNode;
	}

	function isHidden(el){ var style = window.getComputedStyle(el); return (style.display === 'none' || style.visibility === 'hidden'  || style.opacity === '0' ); }
}

var Timers =
{
    config: {},

    timers: {},
    intervals: {},
    sequences: {},

    windowTimeouts: {},

    setTimeout: function(id, callback, time){
        if( this.timers[id] )
        {
            window.clearTimeout(this.timers[id]);
        }

        var that = this;

        this.timers[id] = window.setTimeout( function(){ delete that.timers[id]; window.requestAnimationFrame( callback );  }, time );
    },

    unsetTimeout: function(id){
        if( this.timers[id] )
        {
            window.clearTimeout(this.timers[id]);
            this.timers[id] = null;
            delete this.timers[id];

            return true;
        }
        return false;
    },

    setInterval: function(id, callback, time, instant_execution ){
        if( this.timers[id] )
        {
            window.clearInterval(this.timers[id]);
        }
        this.timers[id] = window.setInterval( callback, time );
        this.intervals[id] = { callback : callback, time : time };
        if( instant_execution ) eval(callback);
    },

    unsetInterval: function(id){
        if( this.timers[id] )
        {
            window.clearInterval(this.timers[id]);
            this.timers[id] = null;
            this.intervals[id] = null;
            delete this.timers[id];
            delete this.intervals[id];

            return true;
        }
        return false;
    }
}

function DOM_scroll( type, options )
{
    if( typeof options == 'undefined' ){ options = {}; }

	if( type == 'start' )
	{
		return '<div class="Scroll-wrapper" style="' + ( typeof options.wrapper_padding != 'undefined' && options.wrapper_padding ? 'padding: '+options.wrapper_padding+';' : '' ) + ( typeof options.height != 'undefined' && options.height ? 'height: '+options.height+';' : '' )+( typeof options.width != 'undefined' && options.width ? 'width: '+options.width+';' : '' ) + '" onmouseover="Scroll.update(this)"><div class="Scroll-area" onscroll="Scroll.scroll(this)"><div class="Scroll-content" ' + ( ( typeof options.padding != 'undefined' && options.padding ) ? 'style="padding: ' + options.padding + '"' : '' ) + '>';
	}
	else if( type == 'end' )
	{
		return '</div></div><div class="Scroll-handle-area"><div class="Scroll-handle" style="top:0px" onmousedown="return Scroll.drag(event);"></div></div></div>';
	}
}

function DOM_scrollInfinity( type, options )
{
	if( type == 'start' )
	{
		return '<div class="Scroll-wrapper" style="' + ( typeof options.wrapper_padding != 'undefined' && options.wrapper_padding ? 'padding: '+options.wrapper_padding+';' : '' ) + ( typeof options.height != 'undefined' && options.height ? 'height: '+options.height+';' : '' )+( typeof options.width != 'undefined' && options.width ? 'width: '+options.width+';' : '' ) + '" onmouseover="Scroll.update(this)"><div class="Scroll-area" onscroll="Scroll.infinite(this);Scroll.scroll(this)"><div class="Scroll-content" ' + ( ( typeof options.padding != 'undefined' && options.padding ) ? 'style="padding: ' + options.padding + '"' : '' ) + '>'+((typeof options !== "undefined" && typeof options.prev !== "undefined" && options.prev === false) ? '<div class="Scroll-infinite-block" data-URL="" data-blockID=""></div>' : '')+'<div class="Scroll-infinite-block" data-blockID="' + ( ( typeof options.blockID != 'undefined' && options.blockID ) ? options.blockID : '' ) + '" data-callback="' + ( ( typeof options.callback != 'undefined' && options.callback ) ? options.callback : '' ) + '">';
	}
	else if( type == 'end' )
	{
        return '</div></div></div><div class="Scroll-handle-area"><div class="Scroll-handle" style="top:0px" onmousedown="return Scroll.drag(event);"></div></div></div>';
	}
}


function DOM_request( method, url, data, callback )
{

	var methods = {
		'PUT' 	: 'application/json', //application/octet-stream | application/x-www-form-urlencoded;charset=UTF-8
		'GET'	: '',
		'POST'	: 'application/json',
		'PATCH' : 'application/json',
		'DELETE': 'application/json'
	}

	if( Object.keys( methods ).indexOf( method ) === -1 ){ console.log( 'Unsupported method '+ method ); return null; }
	if( typeof data == 'function' ){ callback = data; data = {}; }


	let requestOptions = { method, headers : new Headers({'Content-Type': methods[ method ], 'Cache-Control' : 'no-cache' }) };
	if( method === 'GET' )
	{
		if( data && Object.keys( data ).length > 0 )
		{
			let params = '';
			for( let param in data )
			{
				params += ( ( params.length ) ? '&' : '' ) + param + '=' + encodeURIComponent( ( typeof data[param] != 'string' ? JSON.stringify( data[param] ) : data[param] ) );
			}
			url += '?'+params;
		}
	}
	else
	{
		requestOptions.body = JSON.stringify(data);
	}
	return fetch( url, requestOptions )
		.then( ( response ) =>
		{
			if( ['application/json'].includes( response.headers.get('Content-Type') ) )
			{
				return response.json();
			}
			else
			{
				return response.text();
			}

		})
		.then( ( response ) =>
		{
			callback( response )
		})
		.catch(e =>
		{
			console.log( e, 'Exception' );
		});
}
