jQuery(function($) {

	// Generate form
	$('<div id="grid-setup" class="grid-auto"><form name="grid-form" class="grid-form grid-hidden"><div class="grid-input-group"> <label>Container width: </label> <input type="text" name="c1" maxlength="6"/></div><div class="grid-input-group"> <label>Columns: </label> <input type="number" name="c2" min="0" max="9999" maxlength="4"/></div><div class="grid-input-group"> <label>Space between columns: </label> <input type="number" name="c3" min="0" max="9999" maxlength="4"/></div><div class="grid-input-group"> <label>First/last column space: </label> <input type="radio" name="c8" value="1"/><span>Yes</span> <input type="radio" name="c8" value="0"/><span>No</span></div><div class="grid-input-group"> <label>Container color: </label> <input type="color" name="c4" maxlength="7"/></div><div class="grid-input-group"> <label>Ccolumns color: </label> <input type="color" name="c5" maxlength="7"/></div><hr class="grid-hr"/><div class="grid-input-group"> <label>Opacity: </label> <input type="number" name="c6" min="0" max="1" step="0.1"/></div><div class="grid-input-group"> <label>Z-index: </label> <input type="number" name="c7" min="-9999999999" max="99999999999" step="1" maxlength="11"/></div><hr class="grid-hr"/> <input type="submit" value="Update Grid"/></form> <button class="grid-btn grid-close">>></button></div>').appendTo('body');

	// Generate containers
	$('<div id="grid-suit"><div id="grid-container"></div></div>').appendTo('body');

	// Generate CSS
	$('<style type="text/css">#grid-setup,#grid-suit{position:fixed;top:0;left:0}#grid-suit{right:0;bottom:0;z-index:10000}#grid-container{background:rgba(200,120,200,.3);width:1200px;height:100%;margin:0 auto;z-index:10}#grid-container>.grid-col{background:#aeeeee;height:100%;float:left}#grid-container>.grid-col:last-child{margin-right:0!important}#grid-setup{background:#fff;box-shadow:0 0 7px 1px rgba(0,0,0,.3);color:#222;padding:12px;width:280px;z-index:16777271}#grid-setup.grid-auto{background:0 0;box-shadow:none;width:auto}#grid-setup .grid-input-group{margin-bottom:6px;width:100%;float:left}#grid-setup .grid-input-group>*{font-family:Sans-serif;font-size:.9em;float:left}#grid-setup .grid-input-group br{clear:left}#grid-setup label{margin:9px 0;text-align:right;width:165px}#grid-setup input[type=color],#grid-setup input[type=number],#grid-setup input[type=text]{background:#fff;border:1px solid #cacaca;border-radius:3px;padding:5px 6px;margin:3px 0;width:80px;float:right}#grid-setup input[type=color]{cursor:pointer;padding:0;margin:6px 0}#grid-setup .grid-btn,#grid-setup input[type=submit]{background:#a0a0a0;border:1px solid #8f8f8f;border-radius:3px;color:#fff;cursor:pointer;font-weight:600;text-shadow:1px 1px 1px #888;padding:7px 12px;float:right}#grid-setup .grid-btn,hr.grid-hr{float:left}#grid-setup input[type=radio]{margin:10px 4px}#grid-setup input[type=radio]:first-of-type{margin:10px 2px 10px 9px}#grid-setup span{margin:9px 2px 9px 0}.grid-form{display:block}.grid-form.grid-hidden{display:none}hr.grid-hr{width:100%;border:none;border-top:1px solid #e9e9e9;margin-top:2px;margin-bottom:10px}</style>').appendTo('head');

	// Static values
	var $parent = $('#grid-container');
	var $cols = $('#grid-container .grid-col');
	var $form = $('form[name=grid-form]');
	
	var default_cols_number = 12;
	var default_container_width = 1200;
	var default_spacing = 15;
	var default_container_color = '#aeeeee';
	var default_column_color = '#eaaaaa';
	var default_opacity = 1;
	var default_z_index = 10;
	var default_first_spacing = 0;


	// Load stored variables
	var retObj = localStorage.getItem('gridCheckPoint');
	var savedGrid = JSON.parse(retObj);

	// If item is found in local storage
	if (savedGrid) {
		if (savedGrid.cols_number) default_cols_number = savedGrid.cols_number;
		if (savedGrid.container_width) default_container_width = savedGrid.container_width;
		if (savedGrid.spacing) default_spacing = savedGrid.spacing;
		if (savedGrid.container_color) default_container_color = savedGrid.container_color;
		if (savedGrid.column_color) default_column_color = savedGrid.column_color;
		if (savedGrid.opacity) default_opacity = savedGrid.opacity;
		if (savedGrid.z_index) default_z_index = savedGrid.z_index;
		if (savedGrid.first_spacing) default_first_spacing = savedGrid.first_spacing;
	}


	// Load show menu state
	var default_showMenu = localStorage.getItem('showMenu');

	if (default_showMenu) {
		if (default_showMenu == 'yes') {
			$('.grid-form').removeClass('grid-hidden');
			$('.grid-btn').text('<<');
			$('#grid-setup').removeClass('grid-auto');
		} else {
			$('.grid-form').addClass('grid-hidden');
			$('.grid-btn').text('>>');
			$('#grid-setup').addClass('grid-auto');
		}
	}


	var grid = new Grid(default_container_width, default_cols_number, default_spacing);

	// Set default values
	grid.setNewData(default_container_width, default_cols_number, default_spacing, default_first_spacing);
	grid.setNewContainerColor(default_container_color);
	grid.setNewColumnColor(default_column_color);
	grid.setNewOpacity(default_opacity);
	grid.setNewZIndex(default_z_index);


	// Set default values in input fields
	$form.find('input[name=c1]').val(default_container_width);
	$form.find('input[name=c2]').val(default_cols_number);
	$form.find('input[name=c3]').val(default_spacing);
	$form.find('input[name=c4]').val(default_container_color);
	$form.find('input[name=c5]').val(default_column_color);
	$form.find('input[name=c6]').val(default_opacity);
	$form.find('input[name=c7]').val(default_z_index);
	$form.find('input[name=c8][value='+default_first_spacing+']').prop('checked', true);


	// Form submit
	$form.submit(function(e) {

		e.preventDefault();
		// Check input for errors
		try {
	        if (!this.c1.value || isNaN(this.c1.value)) {
	        	throw 'Not a number';
	        } else if (this.c1.value < 0) {
	        	throw 'Less than 0';
	        }

	        if (!this.c2.value || isNaN(this.c2.value)) {
	        	throw 'Not a number';
	        } else if (this.c2.value < 0) {
	        	throw 'Less than 0';
	        }

	        if (!this.c3.value || isNaN(this.c3.value)) {
	        	throw 'Not a number';
	        } else if (this.c3.value < 0) {
	        	throw 'Less than 0';
	        }

	        if (!this.c4.value || this.c4.value[0] !== '#') {
	        	throw 'Not a hex value';
	        } else if (this.c4.value.length !== 7) {
	        	throw 'Not a proper hex value';
	        }

	        if (!this.c5.value || this.c5.value[0] !== '#') {
	        	throw 'Not a hex value';
	        } else if (this.c5.value.length !== 7) {
	        	throw 'Not a proper hex value';
	        }

	        if (!this.c6.value) {
	        	throw 'Not a number 6';
	        } else if (this.c6.value < 0) {
	        	throw 'Less than 0';
	        } else if (this.c6.value > 1) {
	        	throw 'Greated than 1';
	        }

	        if (!this.c7.value || isNaN(this.c7.value)) {
	        	throw 'Not a number';
	        }

	        if (!this.c8.value || isNaN(this.c8.value) || this.c8.value < 0 || this.c8.value > 1) {
	        	throw 'Not a number';
	        }


	        // On no error throw
			grid.setNewData(this.c1.value, this.c2.value, this.c3.value, this.c8.value);
			grid.setNewContainerColor(this.c4.value);
			grid.setNewColumnColor(this.c5.value);
			grid.setNewOpacity(this.c6.value);
			grid.setNewZIndex(this.c7.value);

			localStorage.setItem('gridCheckPoint', JSON.stringify(grid));
	    }
	    catch(err) {
	        console.log('Error: '+err);
	    }
	});

	$('.grid-btn').on('click', function() {

		// If form is hidden
		if ($('.grid-form').hasClass('grid-hidden')) {
			$('.grid-form').removeClass('grid-hidden');
			$(this).text('<<');
			$('#grid-setup').removeClass('grid-auto');
			var showMenu = true;
			localStorage.setItem('showMenu', 'yes');
		} else {
			$('.grid-form').addClass('grid-hidden');
			$(this).text('>>');
			$('#grid-setup').addClass('grid-auto');
			var showMenu = false;
			localStorage.setItem('showMenu', 'no');
		}
	});
});

class Grid
{
	constructor(container_width, cols_number, spacing) {

		this.iteration = 0;
		this.container_color = '#aeeeee';
		this.column_color = '#eaaaaaa';
		this.opacity = 1;
		this.z_index = 10;
		this.setNewData(container_width, cols_number, spacing);
	}

	setNewData(container_width, cols_number, spacing, first_spacing) {

		var $parent = jQuery('#grid-container');

		var temp_first_spacing = 1;

		if (first_spacing == 1) {
			temp_first_spacing = 0;
		}

		var temp_width = (container_width - ((cols_number - temp_first_spacing) * spacing)) / cols_number;
		var i = Math.floor(temp_width * 10);
		temp_width = i.toFixed(0);
		temp_width = temp_width / 10;

		this.col_width = temp_width;
		this.container_width = container_width;
		this.cols_number = cols_number;
		this.spacing = spacing;
		this.first_spacing = first_spacing;

		this.recountColumns(cols_number);

		$parent.css('width', container_width+'px');

		jQuery('.grid-col').css({
		    'width': temp_width+'px',
		    'margin-right': spacing+'px'
		});

		if (first_spacing == 1) {

			jQuery('.grid-col').first().css({
			    'margin-left': spacing/2+'px'
			});

			jQuery('.grid-col').last().css({
			    'margin-right': spacing/2+'px'
			});
		}
	}

	setNewColumnColor(color) {

		jQuery('.grid-col').css({
		    'background': color
		});

		this.column_color = color;
	}

	setNewContainerColor(color) {

		jQuery('#grid-container').css({
		    'background': color
		});

		this.container_color = color;
	}

	setNewOpacity(opacity) {

		jQuery('#grid-container').css({
		    'opacity': opacity
		});

		this.opacity = opacity;
	}

	setNewZIndex(z_index) {

		jQuery('#grid-suit').css({
		    'z-index': z_index
		});

		this.z_index = z_index;
	}

	recountColumns(count) {

		var $parent = jQuery('#grid-container');

		$parent.children('.grid-col').remove();

		for (var i = 0; i < count; i++) {
			jQuery('<div class="grid-col"></div>').appendTo($parent);
		}

		this.cols_number = count;
	}

}