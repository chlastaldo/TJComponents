class UIForm
{
	constructor( parentNode, options )
	{
		this._parentNode = parentNode;
		this._options = options;
		this._inputs = {};
	}

	addElement( type, name, value = '', options )
	{
		if( type === 'text' )
		{
			this._inputs[ name ] = new UIFormText( this._parentNode, this._options, name, value = '', options );
		}
	}

	__focus()
	{

	}

	__blur()
	{

	}

	__createElement( tag, classList = '', attributes = {}, html = '', events = {} )
	{
		if( typeof html === 'object' )
		{
			events = html, html = '';
		}
		let element = document.createElement( tag );
			element.classList.add( classList );
			for( let attribute in attributes )
			{
				element.setAttribute( attribute, attributes[ attribute ] );
			}

		if( html !== '' )
		{
			element.innerHTML = html;
		}
		return element;
	}
}

class UIFormText extends UIForm
{
	constructor( parentNode, parentOptions, name, value = '', options )
	{
		super( parentNode, parentOptions )

		this._container = this.__createElement( 'div', 'container_input' );
		this._input = this.__createElement( 'input', 'input', { name , value, id : name } );
		this._label = this.__createElement( 'label', 'label', { for : name }, ( options.label ? options.label : '' ) );

		this._container.appendChild( this._input );
		this._container.appendChild( this._label )
		parentNode.appendChild( this._container );


	}
}
