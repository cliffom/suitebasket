/**
 * Suite Basket - Making shopping baskets sweeter with jQuery
 * http://suitepotato.com/suitebasket/
 *
 * Copyright 2012, Michael Clifford
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * or GPL Version 2 (http://www.opensource.org/licenses/gpl-2.0.php) licenses.
 *
 * This plugin requires the jQuery plugin jCarousel written by Jan Sorgalla
 * http://sorgalla.com/jcarousel/
 */
(function($) {
	var settings;
	var counter;
	var items;
	var basketContainer;
	var basketContainerWidth = 0;

	var methods = {
		init : function(options) {
			if (!jQuery().jcarousel) {
				$.error('Required Plugin Missing. jcarousel is required.');
			}

		    settings = $.extend({
				'backgroundColor' : this.css('background-color'),
				'focusColor': '#eee',
				'widthConstraint': 1.00,
				'itemClass' : 'suitebasket-item'
		   	}, options);

			var basket = this;
			var header = $('<span class="suitebasket-header">Your Basket contains <span class="suitebasket-counter">no items</span></span>');

			items = $('<div class="suitebasket-items"><ul></ul></div>').jcarousel();
			basket.append(items);
			basket.append(header);
			counter = header.find('span.suitebasket-counter');
			basketContainer = items.find('ul');

			basket.droppable({
				out: function(event, ui) {
					basket.suiteBasket('changeFocus', settings['backgroundColor']);
				},
				over: function(event, ui) {
					basket.suiteBasket('changeFocus', settings['focusColor']);
				},
				drop: function(event, ui) {
					var item = basket.suiteBasket('createItemElement', $(ui.helper).clone().find('div'));
					basket.suiteBasket('add', item);
					$(ui.draggable).hide();
					$(ui.helper).remove();
					basket.suiteBasket('changeFocus', settings['backgroundColor']);
				}
			});

			items.click(function(event) {
				event.preventDefault();
				itemElement = 'li.' + settings['itemClass'];
				target = $(event.target);

				if (target.parents().is(itemElement)) {
					basket.suiteBasket('remove', target.parents(itemElement));
				}
			});

			return this;
		},

		count : function() {
			return basketContainer.children().size();
		},

		createItemElement : function(item) {
			item.css('margin', '0 5px');
			var element = $('<li class="'+ settings['itemClass'] +'"></li>').append(item);
			return element;
		},

		add : function(item) {
			basketContainer.append(item);
			this.suiteBasket('resize', 'expand', item.width());
			return this;
		},

		remove : function(item) {
			itemWidth = item.width();
			item.remove();
			this.suiteBasket('resize', 'contract', itemWidth);
			return this;
		},

		resize : function(type, width) {
			this.suiteBasket(type, width);
			counter.html(this.suiteBasket('count') + ' items');
			return this;
		},

		expand : function(width) {
			basketContainerWidth += width;
			if (basketContainerWidth < (this.width() * settings['widthConstraint'])) {
				items.width(items.width() + width);
			} else {
				items.jcarousel('scroll', -1);
			}
			items.jcarousel('reload');
			return this;
		},

		contract : function(width) {
			if (basketContainerWidth < (this.width() * settings['widthConstraint'])) {
				items.width(items.width() - width);
			}
			items.jcarousel('reload');
			basketContainerWidth -= width;
			return this;
		},

		fade : function() {
			this.suiteBasket('changeFocus', settings['backgroundColor']);
			return this;
		},

		focus : function() {
			this.suiteBasket('changeFocus', settings['focusColor']);
			return this;
		},

		changeFocus : function(color) {
			this.animate({backgroundColor: color}, 'fast');
			return this;
		}
	};

	$.fn.suiteBasket = function(method) {
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' +  method + ' does not exist on jQuery.suiteBasket');
		}
	};
})(jQuery);