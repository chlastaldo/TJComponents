class UIForm
{
	constructor( parentNode, options )
	{
		this._parentNode = parentNode;
		this._options = options;
		this._inputs = {};

		this._nodes = this._parentNode.querySelectorAll('UIForm');

	}

	addElements( )
	{

		this._nodes.forEach( ( node ) =>
		{
			if( node.getAttribute( 'type' ) === 'text' )
			{
				this._inputs[ name ] = new UIFormText( this._parentNode, this._options, node );
			}
		} )
	}

	__containerFocus()
	{
		console.log('__containerFocus', this);
		//this._input.focus();
	}
	__focus()
	{
		console.log('__focus', this);
	}

	__blur()
	{
		console.log('__blur', this);
	}
}

class UIFormText extends UIForm
{
	constructor( parentNode, parentOptions, node )
	{
		super( parentNode, parentOptions )

		let [ html, container, input, label ] = this._options.theme.text;
		let fragment = document.createElement('div');
			fragment.innerHTML = html;


		this._container = fragment.querySelector( container );
		this._input = fragment.querySelector( input );
		this._label = fragment.querySelector( label );

		for( let i = 0; i < node.attributes.length; ++i )
		{
			this._input.setAttribute( node.attributes[i].name, node.attributes[i].value );
			if( node.attributes[i].name == 'name' )
			{
				this._label.setAttribute( 'for', node.attributes[i].value );
			}
		}


		this._label.innerHTML = node.innerHTML;

		this._container.addEventListener( 'click', this.__containerFocus.bind(this) );
		this._input.addEventListener( 'focus', this.__focus.bind(this) );
		this._input.addEventListener( 'blur', this.__blur.bind(this) );

		node.replaceWith( fragment.firstChild );
	}
}
