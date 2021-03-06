var BaseModel 	   = require('models/base/model'),
	CellModel 	   = require('models/cell-model'),
	CellView 	   = require('views/cell-view'),
	CellCollection = require('models/cell-collection'),
	CellCollectionView = require('views/cell-collection-view'),
	config    	   = require('config/config');

module.exports = BaseModel.extend({
	
	defaults : {
		title : 	  'A set title',
		description : 'A longer text describing this set',
		path : 		  'path/to/this/set',
		poster : 	  '',
		grid_cols :   '',
		grid_rows :   '',
		cell_width :  '',
		cell_height : '',
		creator : 	  null, // a user model? 
		cells : 	  null  // will be a cell-collection
	},

	modeltype : 'set',
	
	initialize: function () {
    	BaseModel.prototype.initialize.apply(this, arguments);
  	},

  	sync : function ( meth, mdl, opts ) {
  		this.beginSync();

  		if ( meth === 'read' ) {
  			
  			var set_id = this.get('id') || opts.id || null;
  			if ( !set_id ) { throw('No set id given!') }

  			jQuery.ajax({
				url: 'http://' + config.apiHost + '/sets/' + set_id,
				dataType:'json',
				success: function (data) {
					
					// set model from received data
					this.set(data);

					// handle cells as collection
					var cells = [];
					_.each(data.cells,function(cell){
						cell.connection_id = cell.extra.connection_id;
						cells.push(cell);
					});
					var cellCollection = new CellCollection(cells);

					// show cells as collection view
					this.collectionView = new CellCollectionView({
						collection : cellCollection
					});
					
					// set this.attributes.cells to collection
					this.set({
						cells : this.collectionView.collection
					});

					this.finishSync();

					//opts.success(data); // run success callback
				},
				error: function () {
					// throw( err );
					this.abortSync();
					opts.error.apply(null, arguments); // run error callback

				},
				context: this
			});
  		}
  	},

});