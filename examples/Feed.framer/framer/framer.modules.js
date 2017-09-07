require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"FeedComponent":[function(require,module,exports){
var FeedComponent,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

FeedComponent = (function(superClass) {
  extend(FeedComponent, superClass);

  function FeedComponent(options1) {
    var i, item, len, ref;
    this.options = options1 != null ? options1 : {};
    this.spacing = this.options.spacing ? this.options.spacing : 10;
    this.start_y = this.options.start_y ? this.options.start_y : this.spacing;
    this.nextItem_y = this.start_y;
    this.items = this.options.items ? this.options.items : [];
    FeedComponent.__super__.constructor.call(this, this.options);
    this.backgroundColor = this.options.backgroundColor ? this.options.backgroundColor : "#FFFFFF";
    this.scrollHorizontal = false;
    this.name = this.options.name ? this.options.name : 'FeedComponent';
    this.size = this.options.size ? this.options.size : Screen.size;
    this.content.width = Screen.width;
    if (this.items) {
      this.positionItems();
      ref = this.items;
      for (i = 0, len = ref.length; i < len; i++) {
        item = ref[i];
        this.addItemListeners(item);
        item.states = {
          deleted: {
            height: 0,
            animationOptions: {
              curve: Spring({
                damping: 0.5
              }),
              time: 1.5
            }
          }
        };
      }
    }
  }

  FeedComponent.define('items', {
    get: function() {
      return this.options.items;
    },
    set: function(value) {
      return this.options.items = value;
    }
  });

  FeedComponent.define('spacing', {
    get: function() {
      return this.options.spacing;
    },
    set: function(value) {
      return this.options.spacing = value;
    }
  });

  FeedComponent.define('nextItem_y', {
    get: function() {
      return this.options.nextItem_y;
    },
    set: function(value) {
      return this.options.nextItem_y = value;
    }
  });

  FeedComponent.define('start_y', {
    get: function() {
      return this.options.start_y;
    },
    set: function(value) {
      return this.options.start_y = value;
    }
  });

  FeedComponent.prototype.addItem = function(item, callback, options) {
    item.x = 0;
    item.parent = this.content;
    item.options = options;
    item.centerX();
    item.y = this.nextItem_y;
    this.items.push(item);
    this.nextItem_y += item.height + this.spacing;
    item.states = {
      deleted: {
        height: 0,
        animationOptions: {
          curve: Spring({
            damping: 0.5
          }),
          time: 1.5
        }
      }
    };
    item.onTapEnd(function() {
      if (item.parent.parent.isDragging === false) {
        if (callback) {
          return callback(item, options);
        }
      }
    });
    this.addItemListeners(item);
    return this.addShadowToItem(item);
  };

  FeedComponent.prototype.addItemListeners = function(item) {
    var that;
    that = this;
    item.onSwipeLeftEnd(function() {
      return that.hideItem(this);
    });
    return item.onTapStart(function() {
      var animateTap;
      animateTap = new Animation(item, {
        scale: 1.02,
        animationOptions: {
          curve: Spring({
            damping: 0.5
          }),
          time: .01
        }
      });
      animateTap.start();
      return animateTap.once(Events.AnimationEnd, function() {
        return animateTap.reverse().start();
      });
    });
  };

  FeedComponent.prototype.addOverflowButtonToItem = function(chosenItem, button, callback) {
    var item, itemIndex;
    itemIndex = this.items.indexOf(chosenItem);
    if (itemIndex === -1) {
      return;
    }
    item = this.items[itemIndex];
    item = chosenItem;
    button.x = 0;
    button.parent = item.parent;
    button.y = item.y;
    button.x = item.x + item.width - button.width;
    button.bringToFront();
    button.on(Events.Tap, function(e) {
      return callback(item, item.options);
    });
    button.states = {
      deleted: {
        opacity: 0
      }
    };
    return item.button = button;
  };

  FeedComponent.prototype.addShadowToItem = function(item) {
    item.shadowY = 2;
    item.shadowBlur = 5;
    return item.shadowColor = "rgba(131, 140, 199, .1)";
  };

  FeedComponent.prototype.hideItem = function(chosenItem) {
    var itemIndex;
    itemIndex = this.items.indexOf(chosenItem);
    this.items.splice(itemIndex, 1);
    chosenItem.animate('deleted');
    if (chosenItem.button) {
      chosenItem.button.animate('deleted');
    }
    return this.positionItems();
  };

  FeedComponent.prototype.unHideItem = function(item, index) {
    this.items.splice(index, 0, item);
    item.stateSwitch('default');
    if (item.button) {
      item.button.stateSwitch('default');
    }
    return this.positionItems();
  };

  FeedComponent.prototype.positionItems = function() {
    var i, item, len, ref, results;
    this.nextItem_y = this.start_y;
    ref = this.items;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      item = ref[i];
      item.x = 0;
      item.parent = this.content;
      item.centerX();
      item.animate({
        y: this.nextItem_y
      });
      item.once(Events.AnimationEnd, function() {
        if (item.button) {
          return item.button.y = item.y;
        }
      });
      if (item.button) {
        item.button.animate({
          y: this.nextItem_y
        });
      }
      results.push(this.nextItem_y += item.height + this.spacing);
    }
    return results;
  };

  return FeedComponent;

})(ScrollComponent);

module.exports = FeedComponent;


},{}],"myModule":[function(require,module,exports){
exports.myVar = "myVariable";

exports.myFunction = function() {
  return print("myFunction is running");
};

exports.myArray = [1, 2, 3];


},{}]},{},[])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJhbWVyLm1vZHVsZXMuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL1VzZXJzL3NzZWlyYS9Ecm9wYm94IChJREVPKS9Tb2Z0d2FyZSBQbGF5Z3JvdW5kL0ZyYW1lci9GZWVkQ29tcG9uZW50L2V4YW1wbGVzL0ZlZWQuZnJhbWVyL21vZHVsZXMvbXlNb2R1bGUuY29mZmVlIiwiLi4vLi4vLi4vLi4vLi4vVXNlcnMvc3NlaXJhL0Ryb3Bib3ggKElERU8pL1NvZnR3YXJlIFBsYXlncm91bmQvRnJhbWVyL0ZlZWRDb21wb25lbnQvZXhhbXBsZXMvRmVlZC5mcmFtZXIvbW9kdWxlcy9GZWVkQ29tcG9uZW50LmNvZmZlZSIsIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiXSwic291cmNlc0NvbnRlbnQiOlsiIyBBZGQgdGhlIGZvbGxvd2luZyBsaW5lIHRvIHlvdXIgcHJvamVjdCBpbiBGcmFtZXIgU3R1ZGlvLiBcbiMgbXlNb2R1bGUgPSByZXF1aXJlIFwibXlNb2R1bGVcIlxuIyBSZWZlcmVuY2UgdGhlIGNvbnRlbnRzIGJ5IG5hbWUsIGxpa2UgbXlNb2R1bGUubXlGdW5jdGlvbigpIG9yIG15TW9kdWxlLm15VmFyXG5cbmV4cG9ydHMubXlWYXIgPSBcIm15VmFyaWFibGVcIlxuXG5leHBvcnRzLm15RnVuY3Rpb24gPSAtPlxuXHRwcmludCBcIm15RnVuY3Rpb24gaXMgcnVubmluZ1wiXG5cbmV4cG9ydHMubXlBcnJheSA9IFsxLCAyLCAzXSIsImNsYXNzIEZlZWRDb21wb25lbnQgZXh0ZW5kcyBTY3JvbGxDb21wb25lbnRcblx0Y29uc3RydWN0b3I6IChAb3B0aW9ucz17fSkgLT5cblx0XHRAc3BhY2luZyA9IGlmIEBvcHRpb25zLnNwYWNpbmcgdGhlbiBAb3B0aW9ucy5zcGFjaW5nIGVsc2UgMTBcblx0XHRAc3RhcnRfeSA9ICBpZiBAb3B0aW9ucy5zdGFydF95IHRoZW4gQG9wdGlvbnMuc3RhcnRfeSBlbHNlIEBzcGFjaW5nXG5cdFx0QG5leHRJdGVtX3kgPSBAc3RhcnRfeVxuXHRcdEBpdGVtcyA9IGlmIEBvcHRpb25zLml0ZW1zIHRoZW4gQG9wdGlvbnMuaXRlbXMgZWxzZSBbXVxuXHRcdFxuXHRcdHN1cGVyIEBvcHRpb25zXG5cdFx0QC5iYWNrZ3JvdW5kQ29sb3IgPSBpZiBAb3B0aW9ucy5iYWNrZ3JvdW5kQ29sb3IgdGhlbiBAb3B0aW9ucy5iYWNrZ3JvdW5kQ29sb3IgZWxzZSBcIiNGRkZGRkZcIlxuXHRcdEAuc2Nyb2xsSG9yaXpvbnRhbCA9IGZhbHNlXG5cdFx0QC5uYW1lID0gIGlmIEBvcHRpb25zLm5hbWUgdGhlbiBAb3B0aW9ucy5uYW1lIGVsc2UgJ0ZlZWRDb21wb25lbnQnXG5cdFx0QC5zaXplID0gaWYgQG9wdGlvbnMuc2l6ZSB0aGVuIEBvcHRpb25zLnNpemUgZWxzZSBTY3JlZW4uc2l6ZVxuXHRcdEAuY29udGVudC53aWR0aCA9IFNjcmVlbi53aWR0aFxuXG5cblx0XHRpZiBAaXRlbXMgXG5cdFx0XHRAcG9zaXRpb25JdGVtcygpXG5cdFx0XHRmb3IgaXRlbSBpbiBAaXRlbXNcblx0XHRcdFx0QGFkZEl0ZW1MaXN0ZW5lcnMoaXRlbSlcblx0XHRcdFx0aXRlbS5zdGF0ZXMgPSBcblx0XHRcdFx0XHRkZWxldGVkOlxuXHRcdFx0XHRcdFx0aGVpZ2h0OiAwXG5cdFx0XHRcdFx0XHQjIG1pZ2h0IHdhbnQgdG8gYW5pbWF0ZSBZIGFzIHdlbGxcblx0XHRcdFx0XHRcdGFuaW1hdGlvbk9wdGlvbnM6XG5cdFx0XHRcdFx0XHRcdGN1cnZlOiBTcHJpbmcoZGFtcGluZzogMC41KVxuXHRcdFx0XHRcdFx0XHR0aW1lOiAxLjVcblx0XHRcdFx0XHRcdFxuXHRAZGVmaW5lICdpdGVtcycsXG5cdFx0Z2V0OiAtPlxuXHRcdFx0QG9wdGlvbnMuaXRlbXNcblx0XHRzZXQ6ICh2YWx1ZSkgLT5cblx0XHRcdEBvcHRpb25zLml0ZW1zID0gdmFsdWVcblx0XHRcdFxuXHRAZGVmaW5lICdzcGFjaW5nJyxcblx0XHRnZXQ6IC0+XG5cdFx0XHRAb3B0aW9ucy5zcGFjaW5nXG5cdFx0c2V0OiAodmFsdWUpIC0+XG5cdFx0XHRAb3B0aW9ucy5zcGFjaW5nID0gdmFsdWVcblx0XHRcdFxuXHRAZGVmaW5lICduZXh0SXRlbV95Jyxcblx0XHRnZXQ6IC0+XG5cdFx0XHRAb3B0aW9ucy5uZXh0SXRlbV95XG5cdFx0c2V0OiAodmFsdWUpIC0+XG5cdFx0XHRAb3B0aW9ucy5uZXh0SXRlbV95ID0gdmFsdWVcblx0XHRcdFxuXHRAZGVmaW5lICdzdGFydF95Jyxcblx0XHRnZXQ6IC0+XG5cdFx0XHRAb3B0aW9ucy5zdGFydF95XG5cdFx0c2V0OiAodmFsdWUpIC0+XG5cdFx0XHRAb3B0aW9ucy5zdGFydF95ID0gdmFsdWVcblx0XG5cdGFkZEl0ZW06IChpdGVtLCBjYWxsYmFjaywgb3B0aW9ucykgLT5cblx0XHRpdGVtLnggPSAwXG5cdFx0aXRlbS5wYXJlbnQgPSBALmNvbnRlbnRcblx0XHRpdGVtLm9wdGlvbnMgPSBvcHRpb25zXG5cdFx0aXRlbS5jZW50ZXJYKClcblx0XHRpdGVtLnkgPSBALm5leHRJdGVtX3lcblx0XHRALml0ZW1zLnB1c2goaXRlbSlcblx0XHRALm5leHRJdGVtX3kgKz0gaXRlbS5oZWlnaHQgKyBALnNwYWNpbmdcblx0XHRcblx0XHRpdGVtLnN0YXRlcyA9IFxuXHRcdFx0ZGVsZXRlZDpcblx0XHRcdFx0aGVpZ2h0OiAwXG5cdFx0XHRcdCMgbWlnaHQgd2FudCB0byBhbmltYXRlIFkgYXMgd2VsbFxuXHRcdFx0XHRhbmltYXRpb25PcHRpb25zOlxuXHRcdFx0XHRcdGN1cnZlOiBTcHJpbmcoZGFtcGluZzogMC41KVxuXHRcdFx0XHRcdHRpbWU6IDEuNVxuXHRcdFx0XHRcdFxuXHRcdGl0ZW0ub25UYXBFbmQgLT5cblx0XHRcdGlmIGl0ZW0ucGFyZW50LnBhcmVudC5pc0RyYWdnaW5nIGlzIGZhbHNlXG5cdFx0XHRcdGlmIGNhbGxiYWNrXG5cdFx0XHRcdFx0Y2FsbGJhY2soaXRlbSwgb3B0aW9ucylcblx0XHRcdFxuXHRcdEBhZGRJdGVtTGlzdGVuZXJzKGl0ZW0pXG5cdFx0QGFkZFNoYWRvd1RvSXRlbShpdGVtKVxuXHRcdFxuXG5cdGFkZEl0ZW1MaXN0ZW5lcnM6IChpdGVtKSAtPlx0XHRcdFxuXHRcdHRoYXQgPSBAXG5cdFx0aXRlbS5vblN3aXBlTGVmdEVuZCAtPlxuXHRcdFx0dGhhdC5oaWRlSXRlbSh0aGlzKVxuXG5cdFx0IyBzYW5pdHkgY2hlY2sgdGhhdCB0b3VjaCB3YXMgcmVjb2duaXplZFxuXHRcdGl0ZW0ub25UYXBTdGFydCAtPlxuXHRcdFx0YW5pbWF0ZVRhcCA9IG5ldyBBbmltYXRpb24gaXRlbSxcblx0XHRcdFx0c2NhbGU6IDEuMDJcblx0XHRcdFx0YW5pbWF0aW9uT3B0aW9uczpcblx0XHRcdFx0XHRjdXJ2ZTogU3ByaW5nKGRhbXBpbmc6IDAuNSlcblx0XHRcdFx0XHR0aW1lOiAuMDFcblx0XHRcdFx0XHRcblx0XHRcdGFuaW1hdGVUYXAuc3RhcnQoKVxuIFxuXHRcdFx0YW5pbWF0ZVRhcC5vbmNlIEV2ZW50cy5BbmltYXRpb25FbmQsIC0+XG5cdFx0XHRcdGFuaW1hdGVUYXAucmV2ZXJzZSgpLnN0YXJ0KClcblx0XG5cblx0YWRkT3ZlcmZsb3dCdXR0b25Ub0l0ZW06IChjaG9zZW5JdGVtLCBidXR0b24sIGNhbGxiYWNrKSAtPlxuXHRcdGl0ZW1JbmRleCA9IEAuaXRlbXMuaW5kZXhPZihjaG9zZW5JdGVtKVxuXG5cdFx0aWYgaXRlbUluZGV4ID09IC0xIFxuXHRcdFx0cmV0dXJuXG5cblx0XHRpdGVtID0gQC5pdGVtc1tpdGVtSW5kZXhdXG5cdFx0aXRlbSA9IGNob3Nlbkl0ZW1cblxuXHRcdGJ1dHRvbi54ID0gMFxuXHRcdGJ1dHRvbi5wYXJlbnQgPSBpdGVtLnBhcmVudFxuXHRcdGJ1dHRvbi55ID0gaXRlbS55XG5cdFx0YnV0dG9uLnggPSBpdGVtLnggKyBpdGVtLndpZHRoIC0gYnV0dG9uLndpZHRoXG5cblx0XHRidXR0b24uYnJpbmdUb0Zyb250KClcblxuXHRcdGJ1dHRvbi5vbiBFdmVudHMuVGFwLCAoZSkgLT5cblx0XHRcdGNhbGxiYWNrKGl0ZW0sIGl0ZW0ub3B0aW9ucylcblxuXHRcdGJ1dHRvbi5zdGF0ZXMgPSBcblx0XHRcdGRlbGV0ZWQ6XG5cdFx0XHRcdG9wYWNpdHk6IDBcblxuXG5cdFx0aXRlbS5idXR0b24gPSBidXR0b25cblx0XHRcblx0XG5cdGFkZFNoYWRvd1RvSXRlbTogKGl0ZW0pIC0+XG5cdFx0aXRlbS5zaGFkb3dZID0gMlxuXHRcdGl0ZW0uc2hhZG93Qmx1ciA9IDUgXG5cdFx0aXRlbS5zaGFkb3dDb2xvciA9IFwicmdiYSgxMzEsIDE0MCwgMTk5LCAuMSlcIiBcblxuXHRcdFx0XHRcblx0aGlkZUl0ZW06IChjaG9zZW5JdGVtKSAtPlxuXHRcdGl0ZW1JbmRleCA9IEAuaXRlbXMuaW5kZXhPZihjaG9zZW5JdGVtKVxuXHRcdEAuaXRlbXMuc3BsaWNlKGl0ZW1JbmRleCwgMSlcblx0XHRjaG9zZW5JdGVtLmFuaW1hdGUoJ2RlbGV0ZWQnKVxuXHRcdGlmIGNob3Nlbkl0ZW0uYnV0dG9uXG5cdFx0XHRjaG9zZW5JdGVtLmJ1dHRvbi5hbmltYXRlKCdkZWxldGVkJylcblxuXHRcdEAucG9zaXRpb25JdGVtcygpXG5cblxuXHR1bkhpZGVJdGVtOiAoaXRlbSwgaW5kZXgpIC0+XG5cblx0XHRALml0ZW1zLnNwbGljZShpbmRleCwgMCwgaXRlbSlcdFx0XG5cdFx0aXRlbS5zdGF0ZVN3aXRjaCgnZGVmYXVsdCcpXG5cdFx0aWYgaXRlbS5idXR0b25cblx0XHRcdGl0ZW0uYnV0dG9uLnN0YXRlU3dpdGNoKCdkZWZhdWx0Jylcblx0XHRcblx0XHRAcG9zaXRpb25JdGVtcygpXG5cblx0cG9zaXRpb25JdGVtczogLT5cblx0XHRAbmV4dEl0ZW1feSA9IEBzdGFydF95IFx0XG5cdFx0Zm9yIGl0ZW0gaW4gQGl0ZW1zXG5cdFx0XHRpdGVtLnggPSAwXG5cdFx0XHRpdGVtLnBhcmVudCA9IEAuY29udGVudFxuXHRcdFx0aXRlbS5jZW50ZXJYKClcblx0XHRcdGl0ZW0uYW5pbWF0ZSBcblx0XHRcdFx0eSA6IEBuZXh0SXRlbV95XG5cblx0XHRcdGl0ZW0ub25jZSBFdmVudHMuQW5pbWF0aW9uRW5kLCAtPlxuXHRcdFx0XHRpZiBpdGVtLmJ1dHRvblxuXHRcdFx0XHRcdGl0ZW0uYnV0dG9uLnkgPSBpdGVtLnlcblxuXHRcdFx0aWYgaXRlbS5idXR0b25cblx0XHRcdFx0aXRlbS5idXR0b24uYW5pbWF0ZVxuXHRcdFx0XHRcdHkgOiBAbmV4dEl0ZW1feVxuXHRcdFx0XHRcblx0XHRcdEBuZXh0SXRlbV95ICs9IGl0ZW0uaGVpZ2h0ICsgQHNwYWNpbmdcblxubW9kdWxlLmV4cG9ydHMgPSBGZWVkQ29tcG9uZW50IiwiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFFQUE7QURBQSxJQUFBLGFBQUE7RUFBQTs7O0FBQU07OztFQUNRLHVCQUFDLFFBQUQ7QUFDWixRQUFBO0lBRGEsSUFBQyxDQUFBLDZCQUFELFdBQVM7SUFDdEIsSUFBQyxDQUFBLE9BQUQsR0FBYyxJQUFDLENBQUEs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
