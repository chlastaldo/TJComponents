class UIForm
{
	constructor( parentNode, options )
	{
		this._parentNode = parentNode;
		this._options = options;
		this._inputs = {};

		this._nodes = this._parentNode.querySelectorAll('UIForm');
		
		this._nodes.forEach( ( node ) =>
		{
			if( node.getAttribute( 'type' ) === 'text' )
			{
				this._inputs[ name ] = new UIFormText( this._options, node );
			}
		} )

	}
}

class UIFormElements 
{
	constructor( parentOptions )
	{
		this._parentOptions = parentOptions;
		this._theme = this._parentOptions.theme;
	}
	
	__containerFocus()
	{
		console.log('__containerFocus');
		this._input.focus();
	}
	__focus()
	{
		console.log('__focus');
	}

	__blur()
	{
		console.log('__blur');
	}
}

class UIFormText extends UIFormElements
{
	constructor( parentOptions, node )
	{
		super( parentOptions )

		let [ html, container, input, label ] = this._theme.text;
		let fragment = document.createElement('div');
			fragment.innerHTML = html;


		this._container = fragment.querySelector( container );
		this._input = fragment.querySelector( input );
		this._label = fragment.querySelector( label );

		for( let i = 0; i < node.attributes.length; ++i )
		{
			if( node.attributes[i].name.substr(0, 2 ) === 'on' )
			{
				this._input.addEventListener( node.attributes[i].name.substr(2, node.attributes[i].name.length ), function () { eval( node.attributes[i].value ) } );
			}
			else
			{
				this._input.setAttribute( node.attributes[i].name, node.attributes[i].value );
				if( node.attributes[i].name == 'id' )
				{
					this._label.setAttribute( 'for', node.attributes[i].value );
				}
			}
		}


		this._label.innerHTML = node.innerHTML;

		this._container.addEventListener( 'click', this.__containerFocus.bind(this) );
		this._input.addEventListener( 'focus', this.__focus.bind(this) );
		this._input.addEventListener( 'blur', this.__blur.bind(this) );

		node.replaceWith( fragment.firstChild );
	}
}
