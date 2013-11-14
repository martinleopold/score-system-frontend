BaseView = require('views/base/view');

// see ```views/cell-types``` for per cell type views

module.exports = BaseView.extend({
	// attributes governing how a cell behaves in the view
	// cell types have default values. can be overridden via fields
	// these are the defaults use by most cell types
	defaultViewAttributes : {
		autoload : 1, // automatically open a cell on set load or scroll in?
		sticky : 1, // close a cell on scroll out?
		solo: 0 // close other cells on open?
	},

	events: {
		click: function () {
			/* some cells only fully render on click */
		}
	},

	initialize : function ( opts ) {

		BaseView.prototype.initialize.apply(this,arguments);

		try {
			// per type template, separated from per type views to remove
			// the need to define them just to have spacialized templates
			this.template = require('views/templates/cell-types/cell-'+opts.model.get('type'));
		} catch (e) {
			// ignore, uses default template
		}

		// fill in missing view attributs with defaults
		_.defaults(this.model.attributes, this.defaultViewAttributes);
	},

	autoRender : false,
	className : 'cell',
	//region : 'grid',
	template : require('views/templates/cell'),

	// always on for now, see setActive / setInactive and render
	active : false,

	getTemplateData : function () {
		var data = _.extend({},this.model.attributes);
		data.content = '';
		return data;
	},

	render : function () {
		console.log("rendering");
		console.log(this);

		if ( this.active ) {
			BaseView.prototype.render.apply(this,arguments);

			this.$el.addClass( 'type-' + this.model.get('type') );
			this.$el.addClass( this.cid ); // add view id as class (viewXX) to make debugging easier

			// use cell fields that start with "css-" as css attributes on the $el
			var cssOpts = {
				'background-image': 'url('+this.model.getPosterImageURL()+')'
			};
			attribs = {};
			_.filter(this.model.attributes.fields,function(f){
				return /^css-/i.test(f.name);
			}).map(function(f){
				attribs[f.name.replace(/^css-/i,'')] = f.value;
			});
			cssOpts = _.extend(cssOpts,attribs);
			this.$el.css(cssOpts);
		}

		return this;
	},
	
	activate : function () {
		if ( !this.active ) {
			this.active = true;
			this.render();
		}
		// console.log("activate: " + this.cid);
	},

	deactivate : function () {
		this.active = false;
		this.$el.empty();
		// console.log("deactivate: " + this.cid);
	}
});