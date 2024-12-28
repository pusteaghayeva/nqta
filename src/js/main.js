$('.header-search-wrapper .search-main').click(function () {
  $('.search-form-main').toggleClass('active-search');
  $('.search-form-main .search-field').focus();
});
// navbar
$(function () {
  var $ul = $('.sidebar-navigation > ul');

  $ul.find('li a').click(function (e) {
    var $li = $(this).parent();

    if ($li.find('ul').length > 0) {
      e.preventDefault();

      if ($li.hasClass('selected')) {
        $li.removeClass('selected').find('li').removeClass('selected');
        $li.find('ul').slideUp(400);
        $li.find('a em').removeClass('mdi-flip-v');
      } else {

        if ($li.parents('li.selected').length == 0) {
          $ul.find('li').removeClass('selected');
          $ul.find('ul').slideUp(400);
          $ul.find('li a em').removeClass('mdi-flip-v');
        } else {
          $li.parent().find('li').removeClass('selected');
          $li.parent().find('> li ul').slideUp(400);
          $li.parent().find('> li a em').removeClass('mdi-flip-v');
        }

        $li.addClass('selected');
        $li.find('>ul').slideDown(400);
        $li.find('>a>em').addClass('mdi-flip-v');
      }
    }
  });


  $('.sidebar-navigation > ul ul').each(function (i) {
    if ($(this).find('>li>ul').length > 0) {
      var paddingLeft = $(this).parent().parent().find('>li>a').css('padding-left');
      var pIntPLeft = parseInt(paddingLeft);
      var result = pIntPLeft + 20;

      $(this).find('>li>a').css('padding-left', result);
    } else {
      var paddingLeft = $(this).parent().parent().find('>li>a').css('padding-left');
      var pIntPLeft = parseInt(paddingLeft);
      var result = pIntPLeft + 20;

      $(this).find('>li>a').css('padding-left', result).parent().addClass('selected--last');
    }
  });

  var t = ' li > ul ';
  for (var i = 1; i <= 10; i++) {
    $('.sidebar-navigation > ul > ' + t.repeat(i)).addClass('subMenuColor' + i);
  }

  var activeLi = $('li.selected');
  if (activeLi.length) {
    opener(activeLi);
  }

  function opener(li) {
    var ul = li.closest('ul');
    if (ul.length) {

      li.addClass('selected');
      ul.addClass('open');
      li.find('>a>em').addClass('mdi-flip-v');

      if (ul.closest('li').length) {
        opener(ul.closest('li'));
      } else {
        return false;
      }

    }
  }

});
// navbar end
// Back to top
var amountScrolled = 200;
var amountScrolledNav = 25;

$(window).scroll(function () {
  if ($(window).scrollTop() > amountScrolled) {
    $('button.back-to-top').addClass('show');
  } else {
    $('button.back-to-top').removeClass('show');
  }
});

$('button.back-to-top').click(function () {
  $('html, body').animate({
    scrollTop: 0
  }, 800);
  return false;
});
// back to top end
"use strict";
(function(root, factory) {
  if(typeof exports === 'object') {
    module.exports = factory();
  }
  else if(typeof define === 'function' && define.amd) {
    define(['jquery', 'googlemaps!'], factory);
  }
  else {
    root.GMaps = factory();
  }


}(this, function() {

/*!
 * GMaps.js v0.4.25
 * http://hpneo.github.com/gmaps/
 *
 * Copyright 2017, Gustavo Leon
 * Released under the MIT License.
 */

var extend_object = function(obj, new_obj) {
  var name;

  if (obj === new_obj) {
    return obj;
  }

  for (name in new_obj) {
    if (new_obj[name] !== undefined) {
      obj[name] = new_obj[name];
    }
  }

  return obj;
};

var replace_object = function(obj, replace) {
  var name;

  if (obj === replace) {
    return obj;
  }

  for (name in replace) {
    if (obj[name] != undefined) {
      obj[name] = replace[name];
    }
  }

  return obj;
};

var array_map = function(array, callback) {
  var original_callback_params = Array.prototype.slice.call(arguments, 2),
      array_return = [],
      array_length = array.length,
      i;

  if (Array.prototype.map && array.map === Array.prototype.map) {
    array_return = Array.prototype.map.call(array, function(item) {
      var callback_params = original_callback_params.slice(0);
      callback_params.splice(0, 0, item);

      return callback.apply(this, callback_params);
    });
  }
  else {
    for (i = 0; i < array_length; i++) {
      callback_params = original_callback_params;
      callback_params.splice(0, 0, array[i]);
      array_return.push(callback.apply(this, callback_params));
    }
  }

  return array_return;
};

var array_flat = function(array) {
  var new_array = [],
      i;

  for (i = 0; i < array.length; i++) {
    new_array = new_array.concat(array[i]);
  }

  return new_array;
};

var coordsToLatLngs = function(coords, useGeoJSON) {
  var first_coord = coords[0],
      second_coord = coords[1];

  if (useGeoJSON) {
    first_coord = coords[1];
    second_coord = coords[0];
  }

  return new google.maps.LatLng(first_coord, second_coord);
};

var arrayToLatLng = function(coords, useGeoJSON) {
  var i;

  for (i = 0; i < coords.length; i++) {
    if (!(coords[i] instanceof google.maps.LatLng)) {
      if (coords[i].length > 0 && typeof(coords[i][0]) === "object") {
        coords[i] = arrayToLatLng(coords[i], useGeoJSON);
      }
      else {
        coords[i] = coordsToLatLngs(coords[i], useGeoJSON);
      }
    }
  }

  return coords;
};

var getElementsByClassName = function (class_name, context) {
    var element,
        _class = class_name.replace('.', '');

    if ('jQuery' in this && context) {
        element = $("." + _class, context)[0];
    } else {
        element = document.getElementsByClassName(_class)[0];
    }
    return element;

};

var getElementById = function(id, context) {
  var element,
  id = id.replace('#', '');

  if ('jQuery' in window && context) {
    element = $('#' + id, context)[0];
  } else {
    element = document.getElementById(id);
  };

  return element;
};

var findAbsolutePosition = function(obj)  {
  var curleft = 0,
      curtop = 0;

  if (obj.getBoundingClientRect) {
      var rect = obj.getBoundingClientRect();
      var sx = -(window.scrollX ? window.scrollX : window.pageXOffset);
      var sy = -(window.scrollY ? window.scrollY : window.pageYOffset);

      return [(rect.left - sx), (rect.top - sy)];
  }

  if (obj.offsetParent) {
    do {
      curleft += obj.offsetLeft;
      curtop += obj.offsetTop;
    } while (obj = obj.offsetParent);
  }

  return [curleft, curtop];
};

var GMaps = (function(global) {
  "use strict";

  var doc = document;
  /**
   * Creates a new GMaps instance, including a Google Maps map.
   * @class GMaps
   * @constructs
   * @param {object} options - `options` accepts all the [MapOptions](https://developers.google.com/maps/documentation/javascript/reference#MapOptions) and [events](https://developers.google.com/maps/documentation/javascript/reference#Map) listed in the Google Maps API. Also accepts:
   * * `lat` (number): Latitude of the map's center
   * * `lng` (number): Longitude of the map's center
   * * `el` (string or HTMLElement): container where the map will be rendered
   * * `markerClusterer` (function): A function to create a marker cluster. You can use MarkerClusterer or MarkerClustererPlus.
   */
  var GMaps = function(options) {

    if (!(typeof window.google === 'object' && window.google.maps)) {
      if (typeof window.console === 'object' && window.console.error) {
        console.error('Google Maps API is required. Please register the following JavaScript library https://maps.googleapis.com/maps/api/js.');
      }

      return function() {};
    }

    if (!this) return new GMaps(options);

    options.zoom = options.zoom || 15;
    options.mapType = options.mapType || 'roadmap';

    var valueOrDefault = function(value, defaultValue) {
      return value === undefined ? defaultValue : value;
    };

    var self = this,
        i,
        events_that_hide_context_menu = [
          'bounds_changed', 'center_changed', 'click', 'dblclick', 'drag',
          'dragend', 'dragstart', 'idle', 'maptypeid_changed', 'projection_changed',
          'resize', 'tilesloaded', 'zoom_changed'
        ],
        events_that_doesnt_hide_context_menu = ['mousemove', 'mouseout', 'mouseover'],
        options_to_be_deleted = ['el', 'lat', 'lng', 'mapType', 'width', 'height', 'markerClusterer', 'enableNewStyle'],
        identifier = options.el || options.div,
        markerClustererFunction = options.markerClusterer,
        mapType = google.maps.MapTypeId[options.mapType.toUpperCase()],
        map_center = new google.maps.LatLng(options.lat, options.lng),
        zoomControl = valueOrDefault(options.zoomControl, true),
        zoomControlOpt = options.zoomControlOpt || {
          style: 'DEFAULT',
          position: 'TOP_LEFT'
        },
        zoomControlStyle = zoomControlOpt.style || 'DEFAULT',
        zoomControlPosition = zoomControlOpt.position || 'TOP_LEFT',
        panControl = valueOrDefault(options.panControl, true),
        mapTypeControl = valueOrDefault(options.mapTypeControl, true),
        scaleControl = valueOrDefault(options.scaleControl, true),
        streetViewControl = valueOrDefault(options.streetViewControl, true),
        overviewMapControl = valueOrDefault(overviewMapControl, true),
        map_options = {},
        map_base_options = {
          zoom: this.zoom,
          center: map_center,
          mapTypeId: mapType
        },
        map_controls_options = {
          panControl: panControl,
          zoomControl: zoomControl,
          zoomControlOptions: {
            style: google.maps.ZoomControlStyle[zoomControlStyle],
            position: google.maps.ControlPosition[zoomControlPosition]
          },
          mapTypeControl: mapTypeControl,
          scaleControl: scaleControl,
          streetViewControl: streetViewControl,
          overviewMapControl: overviewMapControl
        };

      if (typeof(options.el) === 'string' || typeof(options.div) === 'string') {
        if (identifier.indexOf("#") > -1) {
            /**
             * Container element
             *
             * @type {HTMLElement}
             */
            this.el = getElementById(identifier, options.context);
        } else {
            this.el = getElementsByClassName.apply(this, [identifier, options.context]);
        }
      } else {
          this.el = identifier;
      }

    if (typeof(this.el) === 'undefined' || this.el === null) {
      throw 'No element defined.';
    }

    window.context_menu = window.context_menu || {};
    window.context_menu[self.el.id] = {};

    /**
     * Collection of custom controls in the map UI
     *
     * @type {array}
     */
    this.controls = [];
    /**
     * Collection of map's overlays
     *
     * @type {array}
     */
    this.overlays = [];
    /**
     * Collection of KML/GeoRSS and FusionTable layers
     *
     * @type {array}
     */
    this.layers = [];
    /**
     * Collection of data layers (See {@link GMaps#addLayer})
     *
     * @type {object}
     */
    this.singleLayers = {};
    /**
     * Collection of map's markers
     *
     * @type {array}
     */
    this.markers = [];
    /**
     * Collection of map's lines
     *
     * @type {array}
     */
    this.polylines = [];
    /**
     * Collection of map's routes requested by {@link GMaps#getRoutes}, {@link GMaps#renderRoute}, {@link GMaps#drawRoute}, {@link GMaps#travelRoute} or {@link GMaps#drawSteppedRoute}
     *
     * @type {array}
     */
    this.routes = [];
    /**
     * Collection of map's polygons
     *
     * @type {array}
     */
    this.polygons = [];
    this.infoWindow = null;
    this.overlay_el = null;
    /**
     * Current map's zoom
     *
     * @type {number}
     */
    this.zoom = options.zoom;
    this.registered_events = {};

    this.el.style.width = options.width || this.el.scrollWidth || this.el.offsetWidth;
    this.el.style.height = options.height || this.el.scrollHeight || this.el.offsetHeight;

    google.maps.visualRefresh = options.enableNewStyle;

    for (i = 0; i < options_to_be_deleted.length; i++) {
      delete options[options_to_be_deleted[i]];
    }

    if(options.disableDefaultUI != true) {
      map_base_options = extend_object(map_base_options, map_controls_options);
    }

    map_options = extend_object(map_base_options, options);

    for (i = 0; i < events_that_hide_context_menu.length; i++) {
      delete map_options[events_that_hide_context_menu[i]];
    }

    for (i = 0; i < events_that_doesnt_hide_context_menu.length; i++) {
      delete map_options[events_that_doesnt_hide_context_menu[i]];
    }

    /**
     * Google Maps map instance
     *
     * @type {google.maps.Map}
     */
    this.map = new google.maps.Map(this.el, map_options);

    if (markerClustererFunction) {
      /**
       * Marker Clusterer instance
       *
       * @type {object}
       */
      this.markerClusterer = markerClustererFunction.apply(this, [this.map]);
    }

    var buildContextMenuHTML = function(control, e) {
      var html = '',
          options = window.context_menu[self.el.id][control];

      for (var i in options){
        if (options.hasOwnProperty(i)) {
          var option = options[i];

          html += '<li><a id="' + control + '_' + i + '" href="#">' + option.title + '</a></li>';
        }
      }

      if (!getElementById('gmaps_context_menu')) return;

      var context_menu_element = getElementById('gmaps_context_menu');

      context_menu_element.innerHTML = html;

      var context_menu_items = context_menu_element.getElementsByTagName('a'),
          context_menu_items_count = context_menu_items.length,
          i;

      for (i = 0; i < context_menu_items_count; i++) {
        var context_menu_item = context_menu_items[i];

        var assign_menu_item_action = function(ev){
          ev.preventDefault();

          options[this.id.replace(control + '_', '')].action.apply(self, [e]);
          self.hideContextMenu();
        };

        google.maps.event.clearListeners(context_menu_item, 'click');
        google.maps.event.addDomListenerOnce(context_menu_item, 'click', assign_menu_item_action, false);
      }

      var position = findAbsolutePosition.apply(this, [self.el]),
          left = position[0] + e.pixel.x - 15,
          top = position[1] + e.pixel.y- 15;

      context_menu_element.style.left = left + "px";
      context_menu_element.style.top = top + "px";

      // context_menu_element.style.display = 'block';
    };

    this.buildContextMenu = function(control, e) {
      if (control === 'marker') {
        e.pixel = {};

        var overlay = new google.maps.OverlayView();
        overlay.setMap(self.map);

        overlay.draw = function() {
          var projection = overlay.getProjection(),
              position = e.marker.getPosition();

          e.pixel = projection.fromLatLngToContainerPixel(position);

          buildContextMenuHTML(control, e);
        };
      }
      else {
        buildContextMenuHTML(control, e);
      }

      var context_menu_element = getElementById('gmaps_context_menu');

      setTimeout(function() {
        context_menu_element.style.display = 'block';
      }, 0);
    };

    /**
     * Add a context menu for a map or a marker.
     *
     * @param {object} options - The `options` object should contain:
     * * `control` (string): Kind of control the context menu will be attached. Can be "map" or "marker".
     * * `options` (array): A collection of context menu items:
     *   * `title` (string): Item's title shown in the context menu.
     *   * `name` (string): Item's identifier.
     *   * `action` (function): Function triggered after selecting the context menu item.
     */
    this.setContextMenu = function(options) {
      window.context_menu[self.el.id][options.control] = {};

      var i,
          ul = doc.createElement('ul');

      for (i in options.options) {
        if (options.options.hasOwnProperty(i)) {
          var option = options.options[i];

          window.context_menu[self.el.id][options.control][option.name] = {
            title: option.title,
            action: option.action
          };
        }
      }

      ul.id = 'gmaps_context_menu';
      ul.style.display = 'none';
      ul.style.position = 'absolute';
      ul.style.minWidth = '100px';
      ul.style.background = 'white';
      ul.style.listStyle = 'none';
      ul.style.padding = '8px';
      ul.style.boxShadow = '2px 2px 6px #ccc';

      if (!getElementById('gmaps_context_menu')) {
        doc.body.appendChild(ul);
      }

      var context_menu_element = getElementById('gmaps_context_menu');

      google.maps.event.addDomListener(context_menu_element, 'mouseout', function(ev) {
        if (!ev.relatedTarget || !this.contains(ev.relatedTarget)) {
          window.setTimeout(function(){
            context_menu_element.style.display = 'none';
          }, 400);
        }
      }, false);
    };

    /**
     * Hide the current context menu
     */
    this.hideContextMenu = function() {
      var context_menu_element = getElementById('gmaps_context_menu');

      if (context_menu_element) {
        context_menu_element.style.display = 'none';
      }
    };

    var setupListener = function(object, name) {
      google.maps.event.addListener(object, name, function(e){
        if (e == undefined) {
          e = this;
        }

        options[name].apply(this, [e]);

        self.hideContextMenu();
      });
    };

    //google.maps.event.addListener(this.map, 'idle', this.hideContextMenu);
    google.maps.event.addListener(this.map, 'zoom_changed', this.hideContextMenu);

    for (var ev = 0; ev < events_that_hide_context_menu.length; ev++) {
      var name = events_that_hide_context_menu[ev];

      if (name in options) {
        setupListener(this.map, name);
      }
    }

    for (var ev = 0; ev < events_that_doesnt_hide_context_menu.length; ev++) {
      var name = events_that_doesnt_hide_context_menu[ev];

      if (name in options) {
        setupListener(this.map, name);
      }
    }

    google.maps.event.addListener(this.map, 'rightclick', function(e) {
      if (options.rightclick) {
        options.rightclick.apply(this, [e]);
      }

      if(window.context_menu[self.el.id]['map'] != undefined) {
        self.buildContextMenu('map', e);
      }
    });

    /**
     * Trigger a `resize` event, useful if you need to repaint the current map (for changes in the viewport or display / hide actions).
     */
    this.refresh = function() {
      google.maps.event.trigger(this.map, 'resize');
    };

    /**
     * Adjust the map zoom to include all the markers added in the map.
     */
    this.fitZoom = function() {
      var latLngs = [],
          markers_length = this.markers.length,
          i;

      for (i = 0; i < markers_length; i++) {
        if(typeof(this.markers[i].visible) === 'boolean' && this.markers[i].visible) {
          latLngs.push(this.markers[i].getPosition());
        }
      }

      this.fitLatLngBounds(latLngs);
    };

    /**
     * Adjust the map zoom to include all the coordinates in the `latLngs` array.
     *
     * @param {array} latLngs - Collection of `google.maps.LatLng` objects.
     */
    this.fitLatLngBounds = function(latLngs) {
      var total = latLngs.length,
          bounds = new google.maps.LatLngBounds(),
          i;

      for(i = 0; i < total; i++) {
        bounds.extend(latLngs[i]);
      }

      this.map.fitBounds(bounds);
    };

    /**
     * Center the map using the `lat` and `lng` coordinates.
     *
     * @param {number} lat - Latitude of the coordinate.
     * @param {number} lng - Longitude of the coordinate.
     * @param {function} [callback] - Callback that will be executed after the map is centered.
     */
    this.setCenter = function(lat, lng, callback) {
      this.map.panTo(new google.maps.LatLng(lat, lng));

      if (callback) {
        callback();
      }
    };

    /**
     * Return the HTML element container of the map.
     *
     * @returns {HTMLElement} the element container.
     */
    this.getElement = function() {
      return this.el;
    };

    /**
     * Increase the map's zoom.
     *
     * @param {number} [magnitude] - The number of times the map will be zoomed in.
     */
    this.zoomIn = function(value) {
      value = value || 1;

      this.zoom = this.map.getZoom() + value;
      this.map.setZoom(this.zoom);
    };

    /**
     * Decrease the map's zoom.
     *
     * @param {number} [magnitude] - The number of times the map will be zoomed out.
     */
    this.zoomOut = function(value) {
      value = value || 1;

      this.zoom = this.map.getZoom() - value;
      this.map.setZoom(this.zoom);
    };

    var native_methods = [],
        method;

    for (method in this.map) {
      if (typeof(this.map[method]) == 'function' && !this[method]) {
        native_methods.push(method);
      }
    }

    for (i = 0; i < native_methods.length; i++) {
      (function(gmaps, scope, method_name) {
        gmaps[method_name] = function(){
          return scope[method_name].apply(scope, arguments);
        };
      })(this, this.map, native_methods[i]);
    }
  };

  return GMaps;
})(this);

GMaps.prototype.createControl = function(options) {
  var control = document.createElement('div');

  control.style.cursor = 'pointer';

  if (options.disableDefaultStyles !== true) {
    control.style.fontFamily = 'Roboto, Arial, sans-serif';
    control.style.fontSize = '11px';
    control.style.boxShadow = 'rgba(0, 0, 0, 0.298039) 0px 1px 4px -1px';
  }

  for (var option in options.style) {
    control.style[option] = options.style[option];
  }

  if (options.id) {
    control.id = options.id;
  }

  if (options.title) {
    control.title = options.title;
  }

  if (options.classes) {
    control.className = options.classes;
  }

  if (options.content) {
    if (typeof options.content === 'string') {
      control.innerHTML = options.content;
    }
    else if (options.content instanceof HTMLElement) {
      control.appendChild(options.content);
    }
  }

  if (options.position) {
    control.position = google.maps.ControlPosition[options.position.toUpperCase()];
  }

  for (var ev in options.events) {
    (function(object, name) {
      google.maps.event.addDomListener(object, name, function(){
        options.events[name].apply(this, [this]);
      });
    })(control, ev);
  }

  control.index = 1;

  return control;
};

/**
 * Add a custom control to the map UI.
 *
 * @param {object} options - The `options` object should contain:
 * * `style` (object): The keys and values of this object should be valid CSS properties and values.
 * * `id` (string): The HTML id for the custom control.
 * * `classes` (string): A string containing all the HTML classes for the custom control.
 * * `content` (string or HTML element): The content of the custom control.
 * * `position` (string): Any valid [`google.maps.ControlPosition`](https://developers.google.com/maps/documentation/javascript/controls#ControlPositioning) value, in lower or upper case.
 * * `events` (object): The keys of this object should be valid DOM events. The values should be functions.
 * * `disableDefaultStyles` (boolean): If false, removes the default styles for the controls like font (family and size), and box shadow.
 * @returns {HTMLElement}
 */
GMaps.prototype.addControl = function(options) {
  var control = this.createControl(options);

  this.controls.push(control);
  this.map.controls[control.position].push(control);

  return control;
};

/**
 * Remove a control from the map. `control` should be a control returned by `addControl()`.
 *
 * @param {HTMLElement} control - One of the controls returned by `addControl()`.
 * @returns {HTMLElement} the removed control.
 */
GMaps.prototype.removeControl = function(control) {
  var position = null,
      i;

  for (i = 0; i < this.controls.length; i++) {
    if (this.controls[i] == control) {
      position = this.controls[i].position;
      this.controls.splice(i, 1);
    }
  }

  if (position) {
    for (i = 0; i < this.map.controls.length; i++) {
      var controlsForPosition = this.map.controls[control.position];

      if (controlsForPosition.getAt(i) == control) {
        controlsForPosition.removeAt(i);

        break;
      }
    }
  }

  return control;
};

GMaps.prototype.createMarker = function(options) {
  if (options.lat == undefined && options.lng == undefined && options.position == undefined) {
    throw 'No latitude or longitude defined.';
  }

  var self = this,
      details = options.details,
      fences = options.fences,
      outside = options.outside,
      base_options = {
        position: new google.maps.LatLng(options.lat, options.lng),
        map: null
      },
      marker_options = extend_object(base_options, options);

  delete marker_options.lat;
  delete marker_options.lng;
  delete marker_options.fences;
  delete marker_options.outside;

  var marker = new google.maps.Marker(marker_options);

  marker.fences = fences;

  if (options.infoWindow) {
    marker.infoWindow = new google.maps.InfoWindow(options.infoWindow);

    var info_window_events = ['closeclick', 'content_changed', 'domready', 'position_changed', 'zindex_changed'];

    for (var ev = 0; ev < info_window_events.length; ev++) {
      (function(object, name) {
        if (options.infoWindow[name]) {
          google.maps.event.addListener(object, name, function(e){
            options.infoWindow[name].apply(this, [e]);
          });
        }
      })(marker.infoWindow, info_window_events[ev]);
    }
  }

  var marker_events = ['animation_changed', 'clickable_changed', 'cursor_changed', 'draggable_changed', 'flat_changed', 'icon_changed', 'position_changed', 'shadow_changed', 'shape_changed', 'title_changed', 'visible_changed', 'zindex_changed'];

  var marker_events_with_mouse = ['dblclick', 'drag', 'dragend', 'dragstart', 'mousedown', 'mouseout', 'mouseover', 'mouseup'];

  for (var ev = 0; ev < marker_events.length; ev++) {
    (function(object, name) {
      if (options[name]) {
        google.maps.event.addListener(object, name, function(){
          options[name].apply(this, [this]);
        });
      }
    })(marker, marker_events[ev]);
  }

  for (var ev = 0; ev < marker_events_with_mouse.length; ev++) {
    (function(map, object, name) {
      if (options[name]) {
        google.maps.event.addListener(object, name, function(me){
          if(!me.pixel){
            me.pixel = map.getProjection().fromLatLngToPoint(me.latLng)
          }

          options[name].apply(this, [me]);
        });
      }
    })(this.map, marker, marker_events_with_mouse[ev]);
  }

  google.maps.event.addListener(marker, 'click', function() {
    this.details = details;

    if (options.click) {
      options.click.apply(this, [this]);
    }

    if (marker.infoWindow) {
      self.hideInfoWindows();
      marker.infoWindow.open(self.map, marker);
    }
  });

  google.maps.event.addListener(marker, 'rightclick', function(e) {
    e.marker = this;

    if (options.rightclick) {
      options.rightclick.apply(this, [e]);
    }

    if (window.context_menu[self.el.id]['marker'] != undefined) {
      self.buildContextMenu('marker', e);
    }
  });

  if (marker.fences) {
    google.maps.event.addListener(marker, 'dragend', function() {
      self.checkMarkerGeofence(marker, function(m, f) {
        outside(m, f);
      });
    });
  }

  return marker;
};

GMaps.prototype.addMarker = function(options) {
  var marker;
  if(options.hasOwnProperty('gm_accessors_')) {
    // Native google.maps.Marker object
    marker = options;
  }
  else {
    if ((options.hasOwnProperty('lat') && options.hasOwnProperty('lng')) || options.position) {
      marker = this.createMarker(options);
    }
    else {
      throw 'No latitude or longitude defined.';
    }
  }

  marker.setMap(this.map);

  if(this.markerClusterer) {
    this.markerClusterer.addMarker(marker);
  }

  this.markers.push(marker);

  GMaps.fire('marker_added', marker, this);

  return marker;
};

GMaps.prototype.addMarkers = function(array) {
  for (var i = 0, marker; marker=array[i]; i++) {
    this.addMarker(marker);
  }

  return this.markers;
};

GMaps.prototype.hideInfoWindows = function() {
  for (var i = 0, marker; marker = this.markers[i]; i++){
    if (marker.infoWindow) {
      marker.infoWindow.close();
    }
  }
};

GMaps.prototype.removeMarker = function(marker) {
  for (var i = 0; i < this.markers.length; i++) {
    if (this.markers[i] === marker) {
      this.markers[i].setMap(null);
      this.markers.splice(i, 1);

      if(this.markerClusterer) {
        this.markerClusterer.removeMarker(marker);
      }

      GMaps.fire('marker_removed', marker, this);

      break;
    }
  }

  return marker;
};

GMaps.prototype.removeMarkers = function (collection) {
  var new_markers = [];

  if (typeof collection == 'undefined') {
    for (var i = 0; i < this.markers.length; i++) {
      var marker = this.markers[i];
      marker.setMap(null);

      GMaps.fire('marker_removed', marker, this);
    }

    if(this.markerClusterer && this.markerClusterer.clearMarkers) {
      this.markerClusterer.clearMarkers();
    }

    this.markers = new_markers;
  }
  else {
    for (var i = 0; i < collection.length; i++) {
      var index = this.markers.indexOf(collection[i]);

      if (index > -1) {
        var marker = this.markers[index];
        marker.setMap(null);

        if(this.markerClusterer) {
          this.markerClusterer.removeMarker(marker);
        }

        GMaps.fire('marker_removed', marker, this);
      }
    }

    for (var i = 0; i < this.markers.length; i++) {
      var marker = this.markers[i];
      if (marker.getMap() != null) {
        new_markers.push(marker);
      }
    }

    this.markers = new_markers;
  }
};

GMaps.prototype.drawOverlay = function(options) {
  var overlay = new google.maps.OverlayView(),
      auto_show = true;

  overlay.setMap(this.map);

  if (options.auto_show != null) {
    auto_show = options.auto_show;
  }

  overlay.onAdd = function() {
    var el = document.createElement('div');

    el.style.borderStyle = "none";
    el.style.borderWidth = "0px";
    el.style.position = "absolute";
    el.style.zIndex = 100;
    el.innerHTML = options.content;

    overlay.el = el;

    if (!options.layer) {
      options.layer = 'overlayLayer';
    }
    
    var panes = this.getPanes(),
        overlayLayer = panes[options.layer],
        stop_overlay_events = ['contextmenu', 'DOMMouseScroll', 'dblclick', 'mousedown'];

    overlayLayer.appendChild(el);

    for (var ev = 0; ev < stop_overlay_events.length; ev++) {
      (function(object, name) {
        google.maps.event.addDomListener(object, name, function(e){
          if (navigator.userAgent.toLowerCase().indexOf('msie') != -1 && document.all) {
            e.cancelBubble = true;
            e.returnValue = false;
          }
          else {
            e.stopPropagation();
          }
        });
      })(el, stop_overlay_events[ev]);
    }

    if (options.click) {
      panes.overlayMouseTarget.appendChild(overlay.el);
      google.maps.event.addDomListener(overlay.el, 'click', function() {
        options.click.apply(overlay, [overlay]);
      });
    }

    google.maps.event.trigger(this, 'ready');
  };

  overlay.draw = function() {
    var projection = this.getProjection(),
        pixel = projection.fromLatLngToDivPixel(new google.maps.LatLng(options.lat, options.lng));

    options.horizontalOffset = options.horizontalOffset || 0;
    options.verticalOffset = options.verticalOffset || 0;

    var el = overlay.el,
        content = el.children[0],
        content_height = content.clientHeight,
        content_width = content.clientWidth;

    switch (options.verticalAlign) {
      case 'top':
        el.style.top = (pixel.y - content_height + options.verticalOffset) + 'px';
        break;
      default:
      case 'middle':
        el.style.top = (pixel.y - (content_height / 2) + options.verticalOffset) + 'px';
        break;
      case 'bottom':
        el.style.top = (pixel.y + options.verticalOffset) + 'px';
        break;
    }

    switch (options.horizontalAlign) {
      case 'left':
        el.style.left = (pixel.x - content_width + options.horizontalOffset) + 'px';
        break;
      default:
      case 'center':
        el.style.left = (pixel.x - (content_width / 2) + options.horizontalOffset) + 'px';
        break;
      case 'right':
        el.style.left = (pixel.x + options.horizontalOffset) + 'px';
        break;
    }

    el.style.display = auto_show ? 'block' : 'none';

    if (!auto_show) {
      options.show.apply(this, [el]);
    }
  };

  overlay.onRemove = function() {
    var el = overlay.el;

    if (options.remove) {
      options.remove.apply(this, [el]);
    }
    else {
      overlay.el.parentNode.removeChild(overlay.el);
      overlay.el = null;
    }
  };

  this.overlays.push(overlay);
  return overlay;
};

GMaps.prototype.removeOverlay = function(overlay) {
  for (var i = 0; i < this.overlays.length; i++) {
    if (this.overlays[i] === overlay) {
      this.overlays[i].setMap(null);
      this.overlays.splice(i, 1);

      break;
    }
  }
};

GMaps.prototype.removeOverlays = function() {
  for (var i = 0, item; item = this.overlays[i]; i++) {
    item.setMap(null);
  }

  this.overlays = [];
};

GMaps.prototype.drawPolyline = function(options) {
  var path = [],
      points = options.path;

  if (points.length) {
    if (points[0][0] === undefined) {
      path = points;
    }
    else {
      for (var i = 0, latlng; latlng = points[i]; i++) {
        path.push(new google.maps.LatLng(latlng[0], latlng[1]));
      }
    }
  }

  var polyline_options = {
    map: this.map,
    path: path,
    strokeColor: options.strokeColor,
    strokeOpacity: options.strokeOpacity,
    strokeWeight: options.strokeWeight,
    geodesic: options.geodesic,
    clickable: true,
    editable: false,
    visible: true
  };

  if (options.hasOwnProperty("clickable")) {
    polyline_options.clickable = options.clickable;
  }

  if (options.hasOwnProperty("editable")) {
    polyline_options.editable = options.editable;
  }

  if (options.hasOwnProperty("icons")) {
    polyline_options.icons = options.icons;
  }

  if (options.hasOwnProperty("zIndex")) {
    polyline_options.zIndex = options.zIndex;
  }

  var polyline = new google.maps.Polyline(polyline_options);

  var polyline_events = ['click', 'dblclick', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'rightclick'];

  for (var ev = 0; ev < polyline_events.length; ev++) {
    (function(object, name) {
      if (options[name]) {
        google.maps.event.addListener(object, name, function(e){
          options[name].apply(this, [e]);
        });
      }
    })(polyline, polyline_events[ev]);
  }

  this.polylines.push(polyline);

  GMaps.fire('polyline_added', polyline, this);

  return polyline;
};

GMaps.prototype.removePolyline = function(polyline) {
  for (var i = 0; i < this.polylines.length; i++) {
    if (this.polylines[i] === polyline) {
      this.polylines[i].setMap(null);
      this.polylines.splice(i, 1);

      GMaps.fire('polyline_removed', polyline, this);

      break;
    }
  }
};

GMaps.prototype.removePolylines = function() {
  for (var i = 0, item; item = this.polylines[i]; i++) {
    item.setMap(null);
  }

  this.polylines = [];
};

GMaps.prototype.drawCircle = function(options) {
  options =  extend_object({
    map: this.map,
    center: new google.maps.LatLng(options.lat, options.lng)
  }, options);

  delete options.lat;
  delete options.lng;

  var polygon = new google.maps.Circle(options),
      polygon_events = ['click', 'dblclick', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'rightclick'];

  for (var ev = 0; ev < polygon_events.length; ev++) {
    (function(object, name) {
      if (options[name]) {
        google.maps.event.addListener(object, name, function(e){
          options[name].apply(this, [e]);
        });
      }
    })(polygon, polygon_events[ev]);
  }

  this.polygons.push(polygon);

  return polygon;
};

GMaps.prototype.drawRectangle = function(options) {
  options = extend_object({
    map: this.map
  }, options);

  var latLngBounds = new google.maps.LatLngBounds(
    new google.maps.LatLng(options.bounds[0][0], options.bounds[0][1]),
    new google.maps.LatLng(options.bounds[1][0], options.bounds[1][1])
  );

  options.bounds = latLngBounds;

  var polygon = new google.maps.Rectangle(options),
      polygon_events = ['click', 'dblclick', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'rightclick'];

  for (var ev = 0; ev < polygon_events.length; ev++) {
    (function(object, name) {
      if (options[name]) {
        google.maps.event.addListener(object, name, function(e){
          options[name].apply(this, [e]);
        });
      }
    })(polygon, polygon_events[ev]);
  }

  this.polygons.push(polygon);

  return polygon;
};

GMaps.prototype.drawPolygon = function(options) {
  var useGeoJSON = false;

  if(options.hasOwnProperty("useGeoJSON")) {
    useGeoJSON = options.useGeoJSON;
  }

  delete options.useGeoJSON;

  options = extend_object({
    map: this.map
  }, options);

  if (useGeoJSON == false) {
    options.paths = [options.paths.slice(0)];
  }

  if (options.paths.length > 0) {
    if (options.paths[0].length > 0) {
      options.paths = array_flat(array_map(options.paths, arrayToLatLng, useGeoJSON));
    }
  }

  var polygon = new google.maps.Polygon(options),
      polygon_events = ['click', 'dblclick', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'rightclick'];

  for (var ev = 0; ev < polygon_events.length; ev++) {
    (function(object, name) {
      if (options[name]) {
        google.maps.event.addListener(object, name, function(e){
          options[name].apply(this, [e]);
        });
      }
    })(polygon, polygon_events[ev]);
  }

  this.polygons.push(polygon);

  GMaps.fire('polygon_added', polygon, this);

  return polygon;
};

GMaps.prototype.removePolygon = function(polygon) {
  for (var i = 0; i < this.polygons.length; i++) {
    if (this.polygons[i] === polygon) {
      this.polygons[i].setMap(null);
      this.polygons.splice(i, 1);

      GMaps.fire('polygon_removed', polygon, this);

      break;
    }
  }
};

GMaps.prototype.removePolygons = function() {
  for (var i = 0, item; item = this.polygons[i]; i++) {
    item.setMap(null);
  }

  this.polygons = [];
};

GMaps.prototype.getFromFusionTables = function(options) {
  var events = options.events;

  delete options.events;

  var fusion_tables_options = options,
      layer = new google.maps.FusionTablesLayer(fusion_tables_options);

  for (var ev in events) {
    (function(object, name) {
      google.maps.event.addListener(object, name, function(e) {
        events[name].apply(this, [e]);
      });
    })(layer, ev);
  }

  this.layers.push(layer);

  return layer;
};

GMaps.prototype.loadFromFusionTables = function(options) {
  var layer = this.getFromFusionTables(options);
  layer.setMap(this.map);

  return layer;
};

GMaps.prototype.getFromKML = function(options) {
  var url = options.url,
      events = options.events;

  delete options.url;
  delete options.events;

  var kml_options = options,
      layer = new google.maps.KmlLayer(url, kml_options);

  for (var ev in events) {
    (function(object, name) {
      google.maps.event.addListener(object, name, function(e) {
        events[name].apply(this, [e]);
      });
    })(layer, ev);
  }

  this.layers.push(layer);

  return layer;
};

GMaps.prototype.loadFromKML = function(options) {
  var layer = this.getFromKML(options);
  layer.setMap(this.map);

  return layer;
};

GMaps.prototype.addLayer = function(layerName, options) {
  //var default_layers = ['weather', 'clouds', 'traffic', 'transit', 'bicycling', 'panoramio', 'places'];
  options = options || {};
  var layer;

  switch(layerName) {
    case 'weather': this.singleLayers.weather = layer = new google.maps.weather.WeatherLayer();
      break;
    case 'clouds': this.singleLayers.clouds = layer = new google.maps.weather.CloudLayer();
      break;
    case 'traffic': this.singleLayers.traffic = layer = new google.maps.TrafficLayer();
      break;
    case 'transit': this.singleLayers.transit = layer = new google.maps.TransitLayer();
      break;
    case 'bicycling': this.singleLayers.bicycling = layer = new google.maps.BicyclingLayer();
      break;
    case 'panoramio':
        this.singleLayers.panoramio = layer = new google.maps.panoramio.PanoramioLayer();
        layer.setTag(options.filter);
        delete options.filter;

        //click event
        if (options.click) {
          google.maps.event.addListener(layer, 'click', function(event) {
            options.click(event);
            delete options.click;
          });
        }
      break;
      case 'places':
        this.singleLayers.places = layer = new google.maps.places.PlacesService(this.map);

        //search, nearbySearch, radarSearch callback, Both are the same
        if (options.search || options.nearbySearch || options.radarSearch) {
          var placeSearchRequest  = {
            bounds : options.bounds || null,
            keyword : options.keyword || null,
            location : options.location || null,
            name : options.name || null,
            radius : options.radius || null,
            rankBy : options.rankBy || null,
            types : options.types || null
          };

          if (options.radarSearch) {
            layer.radarSearch(placeSearchRequest, options.radarSearch);
          }

          if (options.search) {
            layer.search(placeSearchRequest, options.search);
          }

          if (options.nearbySearch) {
            layer.nearbySearch(placeSearchRequest, options.nearbySearch);
          }
        }

        //textSearch callback
        if (options.textSearch) {
          var textSearchRequest  = {
            bounds : options.bounds || null,
            location : options.location || null,
            query : options.query || null,
            radius : options.radius || null
          };

          layer.textSearch(textSearchRequest, options.textSearch);
        }
      break;
  }

  if (layer !== undefined) {
    if (typeof layer.setOptions == 'function') {
      layer.setOptions(options);
    }
    if (typeof layer.setMap == 'function') {
      layer.setMap(this.map);
    }

    return layer;
  }
};

GMaps.prototype.removeLayer = function(layer) {
  if (typeof(layer) == "string" && this.singleLayers[layer] !== undefined) {
     this.singleLayers[layer].setMap(null);

     delete this.singleLayers[layer];
  }
  else {
    for (var i = 0; i < this.layers.length; i++) {
      if (this.layers[i] === layer) {
        this.layers[i].setMap(null);
        this.layers.splice(i, 1);

        break;
      }
    }
  }
};

var travelMode, unitSystem;

GMaps.prototype.getRoutes = function(options) {
  switch (options.travelMode) {
    case 'bicycling':
      travelMode = google.maps.TravelMode.BICYCLING;
      break;
    case 'transit':
      travelMode = google.maps.TravelMode.TRANSIT;
      break;
    case 'driving':
      travelMode = google.maps.TravelMode.DRIVING;
      break;
    default:
      travelMode = google.maps.TravelMode.WALKING;
      break;
  }

  if (options.unitSystem === 'imperial') {
    unitSystem = google.maps.UnitSystem.IMPERIAL;
  }
  else {
    unitSystem = google.maps.UnitSystem.METRIC;
  }

  var base_options = {
        avoidHighways: false,
        avoidTolls: false,
        optimizeWaypoints: false,
        waypoints: []
      },
      request_options =  extend_object(base_options, options);

  request_options.origin = /string/.test(typeof options.origin) ? options.origin : new google.maps.LatLng(options.origin[0], options.origin[1]);
  request_options.destination = /string/.test(typeof options.destination) ? options.destination : new google.maps.LatLng(options.destination[0], options.destination[1]);
  request_options.travelMode = travelMode;
  request_options.unitSystem = unitSystem;

  delete request_options.callback;
  delete request_options.error;

  var self = this,
      routes = [],
      service = new google.maps.DirectionsService();

  service.route(request_options, function(result, status) {
    if (status === google.maps.DirectionsStatus.OK) {
      for (var r in result.routes) {
        if (result.routes.hasOwnProperty(r)) {
          routes.push(result.routes[r]);
        }
      }

      if (options.callback) {
        options.callback(routes, result, status);
      }
    }
    else {
      if (options.error) {
        options.error(result, status);
      }
    }
  });
};

GMaps.prototype.removeRoutes = function() {
  this.routes.length = 0;
};

GMaps.prototype.getElevations = function(options) {
  options = extend_object({
    locations: [],
    path : false,
    samples : 256
  }, options);

  if (options.locations.length > 0) {
    if (options.locations[0].length > 0) {
      options.locations = array_flat(array_map([options.locations], arrayToLatLng,  false));
    }
  }

  var callback = options.callback;
  delete options.callback;

  var service = new google.maps.ElevationService();

  //location request
  if (!options.path) {
    delete options.path;
    delete options.samples;

    service.getElevationForLocations(options, function(result, status) {
      if (callback && typeof(callback) === "function") {
        callback(result, status);
      }
    });
  //path request
  } else {
    var pathRequest = {
      path : options.locations,
      samples : options.samples
    };

    service.getElevationAlongPath(pathRequest, function(result, status) {
     if (callback && typeof(callback) === "function") {
        callback(result, status);
      }
    });
  }
};

GMaps.prototype.cleanRoute = GMaps.prototype.removePolylines;

GMaps.prototype.renderRoute = function(options, renderOptions) {
  var self = this,
      panel = ((typeof renderOptions.panel === 'string') ? document.getElementById(renderOptions.panel.replace('#', '')) : renderOptions.panel),
      display;

  renderOptions.panel = panel;
  renderOptions = extend_object({
    map: this.map
  }, renderOptions);
  display = new google.maps.DirectionsRenderer(renderOptions);

  this.getRoutes({
    origin: options.origin,
    destination: options.destination,
    travelMode: options.travelMode,
    waypoints: options.waypoints,
    unitSystem: options.unitSystem,
    error: options.error,
    avoidHighways: options.avoidHighways,
    avoidTolls: options.avoidTolls,
    optimizeWaypoints: options.optimizeWaypoints,
    callback: function(routes, response, status) {
      if (status === google.maps.DirectionsStatus.OK) {
        display.setDirections(response);
      }
    }
  });
};

GMaps.prototype.drawRoute = function(options) {
  var self = this;

  this.getRoutes({
    origin: options.origin,
    destination: options.destination,
    travelMode: options.travelMode,
    waypoints: options.waypoints,
    unitSystem: options.unitSystem,
    error: options.error,
    avoidHighways: options.avoidHighways,
    avoidTolls: options.avoidTolls,
    optimizeWaypoints: options.optimizeWaypoints,
    callback: function(routes) {
      if (routes.length > 0) {
        var polyline_options = {
          path: routes[routes.length - 1].overview_path,
          strokeColor: options.strokeColor,
          strokeOpacity: options.strokeOpacity,
          strokeWeight: options.strokeWeight
        };

        if (options.hasOwnProperty("icons")) {
          polyline_options.icons = options.icons;
        }

        self.drawPolyline(polyline_options);

        if (options.callback) {
          options.callback(routes[routes.length - 1]);
        }
      }
    }
  });
};

GMaps.prototype.travelRoute = function(options) {
  if (options.origin && options.destination) {
    this.getRoutes({
      origin: options.origin,
      destination: options.destination,
      travelMode: options.travelMode,
      waypoints : options.waypoints,
      unitSystem: options.unitSystem,
      error: options.error,
      callback: function(e) {
        //start callback
        if (e.length > 0 && options.start) {
          options.start(e[e.length - 1]);
        }

        //step callback
        if (e.length > 0 && options.step) {
          var route = e[e.length - 1];
          if (route.legs.length > 0) {
            var steps = route.legs[0].steps;
            for (var i = 0, step; step = steps[i]; i++) {
              step.step_number = i;
              options.step(step, (route.legs[0].steps.length - 1));
            }
          }
        }

        //end callback
        if (e.length > 0 && options.end) {
           options.end(e[e.length - 1]);
        }
      }
    });
  }
  else if (options.route) {
    if (options.route.legs.length > 0) {
      var steps = options.route.legs[0].steps;
      for (var i = 0, step; step = steps[i]; i++) {
        step.step_number = i;
        options.step(step);
      }
    }
  }
};

GMaps.prototype.drawSteppedRoute = function(options) {
  var self = this;

  if (options.origin && options.destination) {
    this.getRoutes({
      origin: options.origin,
      destination: options.destination,
      travelMode: options.travelMode,
      waypoints : options.waypoints,
      error: options.error,
      callback: function(e) {
        //start callback
        if (e.length > 0 && options.start) {
          options.start(e[e.length - 1]);
        }

        //step callback
        if (e.length > 0 && options.step) {
          var route = e[e.length - 1];
          if (route.legs.length > 0) {
            var steps = route.legs[0].steps;
            for (var i = 0, step; step = steps[i]; i++) {
              step.step_number = i;
              var polyline_options = {
                path: step.path,
                strokeColor: options.strokeColor,
                strokeOpacity: options.strokeOpacity,
                strokeWeight: options.strokeWeight
              };

              if (options.hasOwnProperty("icons")) {
                polyline_options.icons = options.icons;
              }

              self.drawPolyline(polyline_options);
              options.step(step, (route.legs[0].steps.length - 1));
            }
          }
        }

        //end callback
        if (e.length > 0 && options.end) {
           options.end(e[e.length - 1]);
        }
      }
    });
  }
  else if (options.route) {
    if (options.route.legs.length > 0) {
      var steps = options.route.legs[0].steps;
      for (var i = 0, step; step = steps[i]; i++) {
        step.step_number = i;
        var polyline_options = {
          path: step.path,
          strokeColor: options.strokeColor,
          strokeOpacity: options.strokeOpacity,
          strokeWeight: options.strokeWeight
        };

        if (options.hasOwnProperty("icons")) {
          polyline_options.icons = options.icons;
        }

        self.drawPolyline(polyline_options);
        options.step(step);
      }
    }
  }
};

GMaps.Route = function(options) {
  this.origin = options.origin;
  this.destination = options.destination;
  this.waypoints = options.waypoints;

  this.map = options.map;
  this.route = options.route;
  this.step_count = 0;
  this.steps = this.route.legs[0].steps;
  this.steps_length = this.steps.length;

  var polyline_options = {
    path: new google.maps.MVCArray(),
    strokeColor: options.strokeColor,
    strokeOpacity: options.strokeOpacity,
    strokeWeight: options.strokeWeight
  };

  if (options.hasOwnProperty("icons")) {
    polyline_options.icons = options.icons;
  }

  this.polyline = this.map.drawPolyline(polyline_options).getPath();
};

GMaps.Route.prototype.getRoute = function(options) {
  var self = this;

  this.map.getRoutes({
    origin : this.origin,
    destination : this.destination,
    travelMode : options.travelMode,
    waypoints : this.waypoints || [],
    error: options.error,
    callback : function() {
      self.route = e[0];

      if (options.callback) {
        options.callback.call(self);
      }
    }
  });
};

GMaps.Route.prototype.back = function() {
  if (this.step_count > 0) {
    this.step_count--;
    var path = this.route.legs[0].steps[this.step_count].path;

    for (var p in path){
      if (path.hasOwnProperty(p)){
        this.polyline.pop();
      }
    }
  }
};

GMaps.Route.prototype.forward = function() {
  if (this.step_count < this.steps_length) {
    var path = this.route.legs[0].steps[this.step_count].path;

    for (var p in path){
      if (path.hasOwnProperty(p)){
        this.polyline.push(path[p]);
      }
    }
    this.step_count++;
  }
};

GMaps.prototype.checkGeofence = function(lat, lng, fence) {
  return fence.containsLatLng(new google.maps.LatLng(lat, lng));
};

GMaps.prototype.checkMarkerGeofence = function(marker, outside_callback) {
  if (marker.fences) {
    for (var i = 0, fence; fence = marker.fences[i]; i++) {
      var pos = marker.getPosition();
      if (!this.checkGeofence(pos.lat(), pos.lng(), fence)) {
        outside_callback(marker, fence);
      }
    }
  }
};

GMaps.prototype.toImage = function(options) {
  var options = options || {},
      static_map_options = {};

  static_map_options['size'] = options['size'] || [this.el.clientWidth, this.el.clientHeight];
  static_map_options['lat'] = this.getCenter().lat();
  static_map_options['lng'] = this.getCenter().lng();

  if (this.markers.length > 0) {
    static_map_options['markers'] = [];
    
    for (var i = 0; i < this.markers.length; i++) {
      static_map_options['markers'].push({
        lat: this.markers[i].getPosition().lat(),
        lng: this.markers[i].getPosition().lng()
      });
    }
  }

  if (this.polylines.length > 0) {
    var polyline = this.polylines[0];
    
    static_map_options['polyline'] = {};
    static_map_options['polyline']['path'] = google.maps.geometry.encoding.encodePath(polyline.getPath());
    static_map_options['polyline']['strokeColor'] = polyline.strokeColor
    static_map_options['polyline']['strokeOpacity'] = polyline.strokeOpacity
    static_map_options['polyline']['strokeWeight'] = polyline.strokeWeight
  }

  return GMaps.staticMapURL(static_map_options);
};

GMaps.staticMapURL = function(options){
  var parameters = [],
      data,
      static_root = (location.protocol === 'file:' ? 'http:' : location.protocol ) + '//maps.googleapis.com/maps/api/staticmap';

  if (options.url) {
    static_root = options.url;
    delete options.url;
  }

  static_root += '?';

  var markers = options.markers;
  
  delete options.markers;

  if (!markers && options.marker) {
    markers = [options.marker];
    delete options.marker;
  }

  var styles = options.styles;

  delete options.styles;

  var polyline = options.polyline;
  delete options.polyline;

  /** Map options **/
  if (options.center) {
    parameters.push('center=' + options.center);
    delete options.center;
  }
  else if (options.address) {
    parameters.push('center=' + options.address);
    delete options.address;
  }
  else if (options.lat) {
    parameters.push(['center=', options.lat, ',', options.lng].join(''));
    delete options.lat;
    delete options.lng;
  }
  else if (options.visible) {
    var visible = encodeURI(options.visible.join('|'));
    parameters.push('visible=' + visible);
  }

  var size = options.size;
  if (size) {
    if (size.join) {
      size = size.join('x');
    }
    delete options.size;
  }
  else {
    size = '630x300';
  }
  parameters.push('size=' + size);

  if (!options.zoom && options.zoom !== false) {
    options.zoom = 15;
  }

  var sensor = options.hasOwnProperty('sensor') ? !!options.sensor : true;
  delete options.sensor;
  parameters.push('sensor=' + sensor);

  for (var param in options) {
    if (options.hasOwnProperty(param)) {
      parameters.push(param + '=' + options[param]);
    }
  }

  /** Markers **/
  if (markers) {
    var marker, loc;

    for (var i = 0; data = markers[i]; i++) {
      marker = [];

      if (data.size && data.size !== 'normal') {
        marker.push('size:' + data.size);
        delete data.size;
      }
      else if (data.icon) {
        marker.push('icon:' + encodeURI(data.icon));
        delete data.icon;
      }

      if (data.color) {
        marker.push('color:' + data.color.replace('#', '0x'));
        delete data.color;
      }

      if (data.label) {
        marker.push('label:' + data.label[0].toUpperCase());
        delete data.label;
      }

      loc = (data.address ? data.address : data.lat + ',' + data.lng);
      delete data.address;
      delete data.lat;
      delete data.lng;

      for(var param in data){
        if (data.hasOwnProperty(param)) {
          marker.push(param + ':' + data[param]);
        }
      }

      if (marker.length || i === 0) {
        marker.push(loc);
        marker = marker.join('|');
        parameters.push('markers=' + encodeURI(marker));
      }
      // New marker without styles
      else {
        marker = parameters.pop() + encodeURI('|' + loc);
        parameters.push(marker);
      }
    }
  }

  /** Map Styles **/
  if (styles) {
    for (var i = 0; i < styles.length; i++) {
      var styleRule = [];
      if (styles[i].featureType){
        styleRule.push('feature:' + styles[i].featureType.toLowerCase());
      }

      if (styles[i].elementType) {
        styleRule.push('element:' + styles[i].elementType.toLowerCase());
      }

      for (var j = 0; j < styles[i].stylers.length; j++) {
        for (var p in styles[i].stylers[j]) {
          var ruleArg = styles[i].stylers[j][p];
          if (p == 'hue' || p == 'color') {
            ruleArg = '0x' + ruleArg.substring(1);
          }
          styleRule.push(p + ':' + ruleArg);
        }
      }

      var rule = styleRule.join('|');
      if (rule != '') {
        parameters.push('style=' + rule);
      }
    }
  }

  /** Polylines **/
  function parseColor(color, opacity) {
    if (color[0] === '#'){
      color = color.replace('#', '0x');

      if (opacity) {
        opacity = parseFloat(opacity);
        opacity = Math.min(1, Math.max(opacity, 0));
        if (opacity === 0) {
          return '0x00000000';
        }
        opacity = (opacity * 255).toString(16);
        if (opacity.length === 1) {
          opacity += opacity;
        }

        color = color.slice(0,8) + opacity;
      }
    }
    return color;
  }

  if (polyline) {
    data = polyline;
    polyline = [];

    if (data.strokeWeight) {
      polyline.push('weight:' + parseInt(data.strokeWeight, 10));
    }

    if (data.strokeColor) {
      var color = parseColor(data.strokeColor, data.strokeOpacity);
      polyline.push('color:' + color);
    }

    if (data.fillColor) {
      var fillcolor = parseColor(data.fillColor, data.fillOpacity);
      polyline.push('fillcolor:' + fillcolor);
    }

    var path = data.path;
    if (path.join) {
      for (var j=0, pos; pos=path[j]; j++) {
        polyline.push(pos.join(','));
      }
    }
    else {
      polyline.push('enc:' + path);
    }

    polyline = polyline.join('|');
    parameters.push('path=' + encodeURI(polyline));
  }

  /** Retina support **/
  var dpi = window.devicePixelRatio || 1;
  parameters.push('scale=' + dpi);

  parameters = parameters.join('&');
  return static_root + parameters;
};

GMaps.prototype.addMapType = function(mapTypeId, options) {
  if (options.hasOwnProperty("getTileUrl") && typeof(options["getTileUrl"]) == "function") {
    options.tileSize = options.tileSize || new google.maps.Size(256, 256);

    var mapType = new google.maps.ImageMapType(options);

    this.map.mapTypes.set(mapTypeId, mapType);
  }
  else {
    throw "'getTileUrl' function required.";
  }
};

GMaps.prototype.addOverlayMapType = function(options) {
  if (options.hasOwnProperty("getTile") && typeof(options["getTile"]) == "function") {
    var overlayMapTypeIndex = options.index;

    delete options.index;

    this.map.overlayMapTypes.insertAt(overlayMapTypeIndex, options);
  }
  else {
    throw "'getTile' function required.";
  }
};

GMaps.prototype.removeOverlayMapType = function(overlayMapTypeIndex) {
  this.map.overlayMapTypes.removeAt(overlayMapTypeIndex);
};

GMaps.prototype.addStyle = function(options) {
  var styledMapType = new google.maps.StyledMapType(options.styles, { name: options.styledMapName });

  this.map.mapTypes.set(options.mapTypeId, styledMapType);
};

GMaps.prototype.setStyle = function(mapTypeId) {
  this.map.setMapTypeId(mapTypeId);
};

GMaps.prototype.createPanorama = function(streetview_options) {
  if (!streetview_options.hasOwnProperty('lat') || !streetview_options.hasOwnProperty('lng')) {
    streetview_options.lat = this.getCenter().lat();
    streetview_options.lng = this.getCenter().lng();
  }

  this.panorama = GMaps.createPanorama(streetview_options);

  this.map.setStreetView(this.panorama);

  return this.panorama;
};

GMaps.createPanorama = function(options) {
  var el = getElementById(options.el, options.context);

  options.position = new google.maps.LatLng(options.lat, options.lng);

  delete options.el;
  delete options.context;
  delete options.lat;
  delete options.lng;

  var streetview_events = ['closeclick', 'links_changed', 'pano_changed', 'position_changed', 'pov_changed', 'resize', 'visible_changed'],
      streetview_options = extend_object({visible : true}, options);

  for (var i = 0; i < streetview_events.length; i++) {
    delete streetview_options[streetview_events[i]];
  }

  var panorama = new google.maps.StreetViewPanorama(el, streetview_options);

  for (var i = 0; i < streetview_events.length; i++) {
    (function(object, name) {
      if (options[name]) {
        google.maps.event.addListener(object, name, function(){
          options[name].apply(this);
        });
      }
    })(panorama, streetview_events[i]);
  }

  return panorama;
};

GMaps.prototype.on = function(event_name, handler) {
  return GMaps.on(event_name, this, handler);
};

GMaps.prototype.off = function(event_name) {
  GMaps.off(event_name, this);
};

GMaps.prototype.once = function(event_name, handler) {
  return GMaps.once(event_name, this, handler);
};

GMaps.custom_events = ['marker_added', 'marker_removed', 'polyline_added', 'polyline_removed', 'polygon_added', 'polygon_removed', 'geolocated', 'geolocation_failed'];

GMaps.on = function(event_name, object, handler) {
  if (GMaps.custom_events.indexOf(event_name) == -1) {
    if(object instanceof GMaps) object = object.map; 
    return google.maps.event.addListener(object, event_name, handler);
  }
  else {
    var registered_event = {
      handler : handler,
      eventName : event_name
    };

    object.registered_events[event_name] = object.registered_events[event_name] || [];
    object.registered_events[event_name].push(registered_event);

    return registered_event;
  }
};

GMaps.off = function(event_name, object) {
  if (GMaps.custom_events.indexOf(event_name) == -1) {
    if(object instanceof GMaps) object = object.map; 
    google.maps.event.clearListeners(object, event_name);
  }
  else {
    object.registered_events[event_name] = [];
  }
};

GMaps.once = function(event_name, object, handler) {
  if (GMaps.custom_events.indexOf(event_name) == -1) {
    if(object instanceof GMaps) object = object.map;
    return google.maps.event.addListenerOnce(object, event_name, handler);
  }
};

GMaps.fire = function(event_name, object, scope) {
  if (GMaps.custom_events.indexOf(event_name) == -1) {
    google.maps.event.trigger(object, event_name, Array.prototype.slice.apply(arguments).slice(2));
  }
  else {
    if(event_name in scope.registered_events) {
      var firing_events = scope.registered_events[event_name];

      for(var i = 0; i < firing_events.length; i++) {
        (function(handler, scope, object) {
          handler.apply(scope, [object]);
        })(firing_events[i]['handler'], scope, object);
      }
    }
  }
};

GMaps.geolocate = function(options) {
  var complete_callback = options.always || options.complete;

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      options.success(position);

      if (complete_callback) {
        complete_callback();
      }
    }, function(error) {
      options.error(error);

      if (complete_callback) {
        complete_callback();
      }
    }, options.options);
  }
  else {
    options.not_supported();

    if (complete_callback) {
      complete_callback();
    }
  }
};

GMaps.geocode = function(options) {
  this.geocoder = new google.maps.Geocoder();
  var callback = options.callback;
  if (options.hasOwnProperty('lat') && options.hasOwnProperty('lng')) {
    options.latLng = new google.maps.LatLng(options.lat, options.lng);
  }

  delete options.lat;
  delete options.lng;
  delete options.callback;
  
  this.geocoder.geocode(options, function(results, status) {
    callback(results, status);
  });
};

if (typeof window.google === 'object' && window.google.maps) {
  //==========================
  // Polygon containsLatLng
  // https://github.com/tparkin/Google-Maps-Point-in-Polygon
  // Poygon getBounds extension - google-maps-extensions
  // http://code.google.com/p/google-maps-extensions/source/browse/google.maps.Polygon.getBounds.js
  if (!google.maps.Polygon.prototype.getBounds) {
    google.maps.Polygon.prototype.getBounds = function(latLng) {
      var bounds = new google.maps.LatLngBounds();
      var paths = this.getPaths();
      var path;

      for (var p = 0; p < paths.getLength(); p++) {
        path = paths.getAt(p);
        for (var i = 0; i < path.getLength(); i++) {
          bounds.extend(path.getAt(i));
        }
      }

      return bounds;
    };
  }

  if (!google.maps.Polygon.prototype.containsLatLng) {
    // Polygon containsLatLng - method to determine if a latLng is within a polygon
    google.maps.Polygon.prototype.containsLatLng = function(latLng) {
      // Exclude points outside of bounds as there is no way they are in the poly
      var bounds = this.getBounds();

      if (bounds !== null && !bounds.contains(latLng)) {
        return false;
      }

      // Raycast point in polygon method
      var inPoly = false;

      var numPaths = this.getPaths().getLength();
      for (var p = 0; p < numPaths; p++) {
        var path = this.getPaths().getAt(p);
        var numPoints = path.getLength();
        var j = numPoints - 1;

        for (var i = 0; i < numPoints; i++) {
          var vertex1 = path.getAt(i);
          var vertex2 = path.getAt(j);

          if (vertex1.lng() < latLng.lng() && vertex2.lng() >= latLng.lng() || vertex2.lng() < latLng.lng() && vertex1.lng() >= latLng.lng()) {
            if (vertex1.lat() + (latLng.lng() - vertex1.lng()) / (vertex2.lng() - vertex1.lng()) * (vertex2.lat() - vertex1.lat()) < latLng.lat()) {
              inPoly = !inPoly;
            }
          }

          j = i;
        }
      }

      return inPoly;
    };
  }

  if (!google.maps.Circle.prototype.containsLatLng) {
    google.maps.Circle.prototype.containsLatLng = function(latLng) {
      if (google.maps.geometry) {
        return google.maps.geometry.spherical.computeDistanceBetween(this.getCenter(), latLng) <= this.getRadius();
      }
      else {
        return true;
      }
    };
  }

  google.maps.Rectangle.prototype.containsLatLng = function(latLng) {
    return this.getBounds().contains(latLng);
  };

  google.maps.LatLngBounds.prototype.containsLatLng = function(latLng) {
    return this.contains(latLng);
  };

  google.maps.Marker.prototype.setFences = function(fences) {
    this.fences = fences;
  };

  google.maps.Marker.prototype.addFence = function(fence) {
    this.fences.push(fence);
  };

  google.maps.Marker.prototype.getId = function() {
    return this['__gm_id'];
  };
}

//==========================
// Array indexOf
// https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/indexOf
if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
      "use strict";
      if (this == null) {
          throw new TypeError();
      }
      var t = Object(this);
      var len = t.length >>> 0;
      if (len === 0) {
          return -1;
      }
      var n = 0;
      if (arguments.length > 1) {
          n = Number(arguments[1]);
          if (n != n) { // shortcut for verifying if it's NaN
              n = 0;
          } else if (n != 0 && n != Infinity && n != -Infinity) {
              n = (n > 0 || -1) * Math.floor(Math.abs(n));
          }
      }
      if (n >= len) {
          return -1;
      }
      var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
      for (; k < len; k++) {
          if (k in t && t[k] === searchElement) {
              return k;
          }
      }
      return -1;
  }
}

return GMaps;
}));
var x, w, E, S, k, D, A, I, H, F, W, B, R, U, V, Y, J, Z, ee, te;
function e() {
    var e = .01 * window.innerHeight;
    document.documentElement.style.setProperty("--vh", e + "px")
}
!function(e, t) {
    "use strict";
    "object" == typeof module && "object" == typeof module.exports ? module.exports = e.document ? t(e, !0) : function(e) {
        if (e.document)
            return t(e);
        throw new Error("jQuery requires a window with a document")
    }
    : t(e)
}("undefined" != typeof window ? window : this, function(C, W) {
    "use strict";
    function y(e) {
        return "function" == typeof e && "number" != typeof e.nodeType && "function" != typeof e.item
    }
    function g(e) {
        return null != e && e === e.window
    }
    var a = []
      , B = Object.getPrototypeOf
      , h = a.slice
      , R = a.flat ? function(e) {
        return a.flat.call(e)
    }
    : function(e) {
        return a.concat.apply([], e)
    }
      , U = a.push
      , V = a.indexOf
      , Y = {}
      , J = Y.toString
      , Z = Y.hasOwnProperty
      , ee = Z.toString
      , te = ee.call(Object)
      , m = {}
      , E = C.document
      , ne = {
        type: !0,
        src: !0,
        nonce: !0,
        noModule: !0
    };
    function X(e, t, n) {
        var i, o, r = (n = n || E).createElement("script");
        if (r.text = e,
        t)
            for (i in ne)
                (o = t[i] || t.getAttribute && t.getAttribute(i)) && r.setAttribute(i, o);
        n.head.appendChild(r).parentNode.removeChild(r)
    }
    function p(e) {
        return null == e ? e + "" : "object" == typeof e || "function" == typeof e ? Y[J.call(e)] || "object" : typeof e
    }
    var x = "3.6.0"
      , S = function(e, t) {
        return new S.fn.init(e,t)
    };
    function Q(e) {
        var t = !!e && "length"in e && e.length
          , n = p(e);
        return !y(e) && !g(e) && ("array" === n || 0 === t || "number" == typeof t && 0 < t && t - 1 in e)
    }
    function i(e, t, n) {
        for (var i = [], o = void 0 !== n; (e = e[t]) && 9 !== e.nodeType; )
            if (1 === e.nodeType) {
                if (o && S(e).is(n))
                    break;
                i.push(e)
            }
        return i
    }
    function G(e, t) {
        for (var n = []; e; e = e.nextSibling)
            1 === e.nodeType && e !== t && n.push(e);
        return n
    }
    S.fn = S.prototype = {
        jquery: x,
        constructor: S,
        length: 0,
        toArray: function() {
            return h.call(this)
        },
        get: function(e) {
            return null == e ? h.call(this) : e < 0 ? this[e + this.length] : this[e]
        },
        pushStack: function(e) {
            return (e = S.merge(this.constructor(), e)).prevObject = this,
            e
        },
        each: function(e) {
            return S.each(this, e)
        },
        map: function(n) {
            return this.pushStack(S.map(this, function(e, t) {
                return n.call(e, t, e)
            }))
        },
        slice: function() {
            return this.pushStack(h.apply(this, arguments))
        },
        first: function() {
            return this.eq(0)
        },
        last: function() {
            return this.eq(-1)
        },
        even: function() {
            return this.pushStack(S.grep(this, function(e, t) {
                return (t + 1) % 2
            }))
        },
        odd: function() {
            return this.pushStack(S.grep(this, function(e, t) {
                return t % 2
            }))
        },
        eq: function(e) {
            var t = this.length
              , e = +e + (e < 0 ? t : 0);
            return this.pushStack(0 <= e && e < t ? [this[e]] : [])
        },
        end: function() {
            return this.prevObject || this.constructor()
        },
        push: U,
        sort: a.sort,
        splice: a.splice
    },
    S.extend = S.fn.extend = function() {
        var e, t, n, i, o, r = arguments[0] || {}, s = 1, a = arguments.length, l = !1;
        for ("boolean" == typeof r && (l = r,
        r = arguments[s] || {},
        s++),
        "object" == typeof r || y(r) || (r = {}),
        s === a && (r = this,
        s--); s < a; s++)
            if (null != (e = arguments[s]))
                for (t in e)
                    n = e[t],
                    "__proto__" !== t && r !== n && (l && n && (S.isPlainObject(n) || (i = Array.isArray(n))) ? (o = r[t],
                    o = i && !Array.isArray(o) ? [] : i || S.isPlainObject(o) ? o : {},
                    i = !1,
                    r[t] = S.extend(l, o, n)) : void 0 !== n && (r[t] = n));
        return r
    }
    ,
    S.extend({
        expando: "jQuery" + (x + Math.random()).replace(/\D/g, ""),
        isReady: !0,
        error: function(e) {
            throw new Error(e)
        },
        noop: function() {},
        isPlainObject: function(e) {
            return !(!e || "[object Object]" !== J.call(e) || (e = B(e)) && ("function" != typeof (e = Z.call(e, "constructor") && e.constructor) || ee.call(e) !== te))
        },
        isEmptyObject: function(e) {
            for (var t in e)
                return !1;
            return !0
        },
        globalEval: function(e, t, n) {
            X(e, {
                nonce: t && t.nonce
            }, n)
        },
        each: function(e, t) {
            var n, i = 0;
            if (Q(e))
                for (n = e.length; i < n && !1 !== t.call(e[i], i, e[i]); i++)
                    ;
            else
                for (i in e)
                    if (!1 === t.call(e[i], i, e[i]))
                        break;
            return e
        },
        makeArray: function(e, t) {
            return t = t || [],
            null != e && (Q(Object(e)) ? S.merge(t, "string" == typeof e ? [e] : e) : U.call(t, e)),
            t
        },
        inArray: function(e, t, n) {
            return null == t ? -1 : V.call(t, e, n)
        },
        merge: function(e, t) {
            for (var n = +t.length, i = 0, o = e.length; i < n; i++)
                e[o++] = t[i];
            return e.length = o,
            e
        },
        grep: function(e, t, n) {
            for (var i = [], o = 0, r = e.length, s = !n; o < r; o++)
                !t(e[o], o) != s && i.push(e[o]);
            return i
        },
        map: function(e, t, n) {
            var i, o, r = 0, s = [];
            if (Q(e))
                for (i = e.length; r < i; r++)
                    null != (o = t(e[r], r, n)) && s.push(o);
            else
                for (r in e)
                    null != (o = t(e[r], r, n)) && s.push(o);
            return R(s)
        },
        guid: 1,
        support: m
    }),
    "function" == typeof Symbol && (S.fn[Symbol.iterator] = a[Symbol.iterator]),
    S.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "), function(e, t) {
        Y["[object " + t + "]"] = t.toLowerCase()
    });
    var x = function(H) {
        function d(e, t) {
            return e = "0x" + e.slice(1) - 65536,
            t || (e < 0 ? String.fromCharCode(65536 + e) : String.fromCharCode(e >> 10 | 55296, 1023 & e | 56320))
        }
        function M(e, t) {
            return t ? "\0" === e ? "�" : e.slice(0, -1) + "\\" + e.charCodeAt(e.length - 1).toString(16) + " " : "\\" + e
        }
        function O() {
            C()
        }
        var t, h, x, r, $, f, F, W, w, l, c, C, E, n, S, p, i, o, g, k = "sizzle" + +new Date, u = H.document, D = 0, B = 0, R = j(), U = j(), V = j(), m = j(), X = function(e, t) {
            return e === t && (c = !0),
            0
        }, Q = {}.hasOwnProperty, s = [], G = s.pop, Y = s.push, T = s.push, J = s.slice, y = function(e, t) {
            for (var n = 0, i = e.length; n < i; n++)
                if (e[n] === t)
                    return n;
            return -1
        }, K = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped", a = "[\\x20\\t\\r\\n\\f]", v = "(?:\\\\[\\da-fA-F]{1,6}" + a + "?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+", Z = "\\[" + a + "*(" + v + ")(?:" + a + "*([*^$|!~]?=)" + a + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + v + "))|)" + a + "*\\]", ee = ":(" + v + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + Z + ")*)|.*)\\)|)", te = new RegExp(a + "+","g"), b = new RegExp("^" + a + "+|((?:^|[^\\\\])(?:\\\\.)*)" + a + "+$","g"), ne = new RegExp("^" + a + "*," + a + "*"), ie = new RegExp("^" + a + "*([>+~]|" + a + ")" + a + "*"), oe = new RegExp(a + "|>"), re = new RegExp(ee), se = new RegExp("^" + v + "$"), _ = {
            ID: new RegExp("^#(" + v + ")"),
            CLASS: new RegExp("^\\.(" + v + ")"),
            TAG: new RegExp("^(" + v + "|[*])"),
            ATTR: new RegExp("^" + Z),
            PSEUDO: new RegExp("^" + ee),
            CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + a + "*(even|odd|(([+-]|)(\\d*)n|)" + a + "*(?:([+-]|)" + a + "*(\\d+)|))" + a + "*\\)|)","i"),
            bool: new RegExp("^(?:" + K + ")$","i"),
            needsContext: new RegExp("^" + a + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + a + "*((?:-\\d)?\\d*)" + a + "*\\)|)(?=[^-]|$)","i")
        }, ae = /HTML$/i, le = /^(?:input|select|textarea|button)$/i, ce = /^h\d$/i, A = /^[^{]+\{\s*\[native \w/, ue = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, de = /[+~]/, I = new RegExp("\\\\[\\da-fA-F]{1,6}" + a + "?|\\\\([^\\r\\n\\f])","g"), he = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g, Ce = ye(function(e) {
            return !0 === e.disabled && "fieldset" === e.nodeName.toLowerCase()
        }, {
            dir: "parentNode",
            next: "legend"
        });
        try {
            T.apply(s = J.call(u.childNodes), u.childNodes),
            s[u.childNodes.length].nodeType
        } catch (t) {
            T = {
                apply: s.length ? function(e, t) {
                    Y.apply(e, J.call(t))
                }
                : function(e, t) {
                    for (var n = e.length, i = 0; e[n++] = t[i++]; )
                        ;
                    e.length = n - 1
                }
            }
        }
        function L(e, t, n, i) {
            var o, r, s, a, l, c, u = t && t.ownerDocument, d = t ? t.nodeType : 9;
            if (n = n || [],
            "string" != typeof e || !e || 1 !== d && 9 !== d && 11 !== d)
                return n;
            if (!i && (C(t),
            t = t || E,
            S)) {
                if (11 !== d && (a = ue.exec(e)))
                    if (o = a[1]) {
                        if (9 === d) {
                            if (!(c = t.getElementById(o)))
                                return n;
                            if (c.id === o)
                                return n.push(c),
                                n
                        } else if (u && (c = u.getElementById(o)) && g(t, c) && c.id === o)
                            return n.push(c),
                            n
                    } else {
                        if (a[2])
                            return T.apply(n, t.getElementsByTagName(e)),
                            n;
                        if ((o = a[3]) && h.getElementsByClassName && t.getElementsByClassName)
                            return T.apply(n, t.getElementsByClassName(o)),
                            n
                    }
                if (h.qsa && !m[e + " "] && (!p || !p.test(e)) && (1 !== d || "object" !== t.nodeName.toLowerCase())) {
                    if (c = e,
                    u = t,
                    1 === d && (oe.test(e) || ie.test(e))) {
                        for ((u = de.test(e) && me(t.parentNode) || t) === t && h.scope || ((s = t.getAttribute("id")) ? s = s.replace(he, M) : t.setAttribute("id", s = k)),
                        r = (l = f(e)).length; r--; )
                            l[r] = (s ? "#" + s : ":scope") + " " + z(l[r]);
                        c = l.join(",")
                    }
                    try {
                        return T.apply(n, u.querySelectorAll(c)),
                        n
                    } catch (t) {
                        m(e, !0)
                    } finally {
                        s === k && t.removeAttribute("id")
                    }
                }
            }
            return W(e.replace(b, "$1"), t, n, i)
        }
        function j() {
            var i = [];
            return function e(t, n) {
                return i.push(t + " ") > x.cacheLength && delete e[i.shift()],
                e[t + " "] = n
            }
        }
        function P(e) {
            return e[k] = !0,
            e
        }
        function N(e) {
            var t = E.createElement("fieldset");
            try {
                return !!e(t)
            } catch (e) {
                return !1
            } finally {
                t.parentNode && t.parentNode.removeChild(t)
            }
        }
        function fe(e, t) {
            for (var n = e.split("|"), i = n.length; i--; )
                x.attrHandle[n[i]] = t
        }
        function pe(e, t) {
            var n = t && e
              , i = n && 1 === e.nodeType && 1 === t.nodeType && e.sourceIndex - t.sourceIndex;
            if (i)
                return i;
            if (n)
                for (; n = n.nextSibling; )
                    if (n === t)
                        return -1;
            return e ? 1 : -1
        }
        function ge(t) {
            return function(e) {
                return "form"in e ? e.parentNode && !1 === e.disabled ? "label"in e ? "label"in e.parentNode ? e.parentNode.disabled === t : e.disabled === t : e.isDisabled === t || e.isDisabled !== !t && Ce(e) === t : e.disabled === t : "label"in e && e.disabled === t
            }
        }
        function q(s) {
            return P(function(r) {
                return r = +r,
                P(function(e, t) {
                    for (var n, i = s([], e.length, r), o = i.length; o--; )
                        e[n = i[o]] && (e[n] = !(t[n] = e[n]))
                })
            })
        }
        function me(e) {
            return e && void 0 !== e.getElementsByTagName && e
        }
        for (t in h = L.support = {},
        $ = L.isXML = function(e) {
            var t = e && e.namespaceURI
              , e = e && (e.ownerDocument || e).documentElement;
            return !ae.test(t || e && e.nodeName || "HTML")
        }
        ,
        C = L.setDocument = function(e) {
            var e;
            return (e = e ? e.ownerDocument || e : u) != E && 9 === e.nodeType && e.documentElement && (n = (E = e).documentElement,
            S = !$(E),
            u != E && (e = E.defaultView) && e.top !== e && (e.addEventListener ? e.addEventListener("unload", O, !1) : e.attachEvent && e.attachEvent("onunload", O)),
            h.scope = N(function(e) {
                return n.appendChild(e).appendChild(E.createElement("div")),
                void 0 !== e.querySelectorAll && !e.querySelectorAll(":scope fieldset div").length
            }),
            h.attributes = N(function(e) {
                return e.className = "i",
                !e.getAttribute("className")
            }),
            h.getElementsByTagName = N(function(e) {
                return e.appendChild(E.createComment("")),
                !e.getElementsByTagName("*").length
            }),
            h.getElementsByClassName = A.test(E.getElementsByClassName),
            h.getById = N(function(e) {
                return n.appendChild(e).id = k,
                !E.getElementsByName || !E.getElementsByName(k).length
            }),
            h.getById ? (x.filter.ID = function(e) {
                var t = e.replace(I, d);
                return function(e) {
                    return e.getAttribute("id") === t
                }
            }
            ,
            x.find.ID = function(e, t) {
                if (void 0 !== t.getElementById && S)
                    return (t = t.getElementById(e)) ? [t] : []
            }
            ) : (x.filter.ID = function(e) {
                var t = e.replace(I, d);
                return function(e) {
                    return (e = void 0 !== e.getAttributeNode && e.getAttributeNode("id")) && e.value === t
                }
            }
            ,
            x.find.ID = function(e, t) {
                if (void 0 !== t.getElementById && S) {
                    var n, i, o, r = t.getElementById(e);
                    if (r) {
                        if ((n = r.getAttributeNode("id")) && n.value === e)
                            return [r];
                        for (o = t.getElementsByName(e),
                        i = 0; r = o[i++]; )
                            if ((n = r.getAttributeNode("id")) && n.value === e)
                                return [r]
                    }
                    return []
                }
            }
            ),
            x.find.TAG = h.getElementsByTagName ? function(e, t) {
                return void 0 !== t.getElementsByTagName ? t.getElementsByTagName(e) : h.qsa ? t.querySelectorAll(e) : void 0
            }
            : function(e, t) {
                var n, i = [], o = 0, r = t.getElementsByTagName(e);
                if ("*" !== e)
                    return r;
                for (; n = r[o++]; )
                    1 === n.nodeType && i.push(n);
                return i
            }
            ,
            x.find.CLASS = h.getElementsByClassName && function(e, t) {
                if (void 0 !== t.getElementsByClassName && S)
                    return t.getElementsByClassName(e)
            }
            ,
            i = [],
            p = [],
            (h.qsa = A.test(E.querySelectorAll)) && (N(function(e) {
                var t;
                n.appendChild(e).innerHTML = "<a id='" + k + "'></a><select id='" + k + "-\r\\' msallowcapture=''><option selected=''></option></select>",
                e.querySelectorAll("[msallowcapture^='']").length && p.push("[*^$]=" + a + "*(?:''|\"\")"),
                e.querySelectorAll("[selected]").length || p.push("\\[" + a + "*(?:value|" + K + ")"),
                e.querySelectorAll("[id~=" + k + "-]").length || p.push("~="),
                (t = E.createElement("input")).setAttribute("name", ""),
                e.appendChild(t),
                e.querySelectorAll("[name='']").length || p.push("\\[" + a + "*name" + a + "*=" + a + "*(?:''|\"\")"),
                e.querySelectorAll(":checked").length || p.push(":checked"),
                e.querySelectorAll("a#" + k + "+*").length || p.push(".#.+[+~]"),
                e.querySelectorAll("\\\f"),
                p.push("[\\r\\n\\f]")
            }),
            N(function(e) {
                e.innerHTML = "<a href='' disabled='disabled'></a><select disabled='disabled'><option/></select>";
                var t = E.createElement("input");
                t.setAttribute("type", "hidden"),
                e.appendChild(t).setAttribute("name", "D"),
                e.querySelectorAll("[name=d]").length && p.push("name" + a + "*[*^$|!~]?="),
                2 !== e.querySelectorAll(":enabled").length && p.push(":enabled", ":disabled"),
                n.appendChild(e).disabled = !0,
                2 !== e.querySelectorAll(":disabled").length && p.push(":enabled", ":disabled"),
                e.querySelectorAll("*,:x"),
                p.push(",.*:")
            })),
            (h.matchesSelector = A.test(o = n.matches || n.webkitMatchesSelector || n.mozMatchesSelector || n.oMatchesSelector || n.msMatchesSelector)) && N(function(e) {
                h.disconnectedMatch = o.call(e, "*"),
                o.call(e, "[s!='']:x"),
                i.push("!=", ee)
            }),
            p = p.length && new RegExp(p.join("|")),
            i = i.length && new RegExp(i.join("|")),
            e = A.test(n.compareDocumentPosition),
            g = e || A.test(n.contains) ? function(e, t) {
                var n = 9 === e.nodeType ? e.documentElement : e, t;
                return e === (t = t && t.parentNode) || !(!t || 1 !== t.nodeType || !(n.contains ? n.contains(t) : e.compareDocumentPosition && 16 & e.compareDocumentPosition(t)))
            }
            : function(e, t) {
                if (t)
                    for (; t = t.parentNode; )
                        if (t === e)
                            return !0;
                return !1
            }
            ,
            X = e ? function(e, t) {
                var n;
                return e === t ? (c = !0,
                0) : !e.compareDocumentPosition - !t.compareDocumentPosition || (1 & (n = (e.ownerDocument || e) == (t.ownerDocument || t) ? e.compareDocumentPosition(t) : 1) || !h.sortDetached && t.compareDocumentPosition(e) === n ? e == E || e.ownerDocument == u && g(u, e) ? -1 : t == E || t.ownerDocument == u && g(u, t) ? 1 : l ? y(l, e) - y(l, t) : 0 : 4 & n ? -1 : 1)
            }
            : function(e, t) {
                if (e === t)
                    return c = !0,
                    0;
                var n, i = 0, o = e.parentNode, r = t.parentNode, s = [e], a = [t];
                if (!o || !r)
                    return e == E ? -1 : t == E ? 1 : o ? -1 : r ? 1 : l ? y(l, e) - y(l, t) : 0;
                if (o === r)
                    return pe(e, t);
                for (n = e; n = n.parentNode; )
                    s.unshift(n);
                for (n = t; n = n.parentNode; )
                    a.unshift(n);
                for (; s[i] === a[i]; )
                    i++;
                return i ? pe(s[i], a[i]) : s[i] == u ? -1 : a[i] == u ? 1 : 0
            }
            ),
            E
        }
        ,
        L.matches = function(e, t) {
            return L(e, null, null, t)
        }
        ,
        L.matchesSelector = function(e, t) {
            if (C(e),
            h.matchesSelector && S && !m[t + " "] && (!i || !i.test(t)) && (!p || !p.test(t)))
                try {
                    var n = o.call(e, t);
                    if (n || h.disconnectedMatch || e.document && 11 !== e.document.nodeType)
                        return n
                } catch (e) {
                    m(t, !0)
                }
            return 0 < L(t, E, null, [e]).length
        }
        ,
        L.contains = function(e, t) {
            return (e.ownerDocument || e) != E && C(e),
            g(e, t)
        }
        ,
        L.attr = function(e, t) {
            (e.ownerDocument || e) != E && C(e);
            var n = x.attrHandle[t.toLowerCase()], n;
            return void 0 !== (n = n && Q.call(x.attrHandle, t.toLowerCase()) ? n(e, t, !S) : void 0) ? n : h.attributes || !S ? e.getAttribute(t) : (n = e.getAttributeNode(t)) && n.specified ? n.value : null
        }
        ,
        L.escape = function(e) {
            return (e + "").replace(he, M)
        }
        ,
        L.error = function(e) {
            throw new Error("Syntax error, unrecognized expression: " + e)
        }
        ,
        L.uniqueSort = function(e) {
            var t, n = [], i = 0, o = 0;
            if (c = !h.detectDuplicates,
            l = !h.sortStable && e.slice(0),
            e.sort(X),
            c) {
                for (; t = e[o++]; )
                    t === e[o] && (i = n.push(o));
                for (; i--; )
                    e.splice(n[i], 1)
            }
            return l = null,
            e
        }
        ,
        r = L.getText = function(e) {
            var t, n = "", i = 0, o = e.nodeType;
            if (o) {
                if (1 === o || 9 === o || 11 === o) {
                    if ("string" == typeof e.textContent)
                        return e.textContent;
                    for (e = e.firstChild; e; e = e.nextSibling)
                        n += r(e)
                } else if (3 === o || 4 === o)
                    return e.nodeValue
            } else
                for (; t = e[i++]; )
                    n += r(t);
            return n
        }
        ,
        (x = L.selectors = {
            cacheLength: 50,
            createPseudo: P,
            match: _,
            attrHandle: {},
            find: {},
            relative: {
                ">": {
                    dir: "parentNode",
                    first: !0
                },
                " ": {
                    dir: "parentNode"
                },
                "+": {
                    dir: "previousSibling",
                    first: !0
                },
                "~": {
                    dir: "previousSibling"
                }
            },
            preFilter: {
                ATTR: function(e) {
                    return e[1] = e[1].replace(I, d),
                    e[3] = (e[3] || e[4] || e[5] || "").replace(I, d),
                    "~=" === e[2] && (e[3] = " " + e[3] + " "),
                    e.slice(0, 4)
                },
                CHILD: function(e) {
                    return e[1] = e[1].toLowerCase(),
                    "nth" === e[1].slice(0, 3) ? (e[3] || L.error(e[0]),
                    e[4] = +(e[4] ? e[5] + (e[6] || 1) : 2 * ("even" === e[3] || "odd" === e[3])),
                    e[5] = +(e[7] + e[8] || "odd" === e[3])) : e[3] && L.error(e[0]),
                    e
                },
                PSEUDO: function(e) {
                    var t, n = !e[6] && e[2];
                    return _.CHILD.test(e[0]) ? null : (e[3] ? e[2] = e[4] || e[5] || "" : n && re.test(n) && (t = (t = f(n, !0)) && n.indexOf(")", n.length - t) - n.length) && (e[0] = e[0].slice(0, t),
                    e[2] = n.slice(0, t)),
                    e.slice(0, 3))
                }
            },
            filter: {
                TAG: function(e) {
                    var t = e.replace(I, d).toLowerCase();
                    return "*" === e ? function() {
                        return !0
                    }
                    : function(e) {
                        return e.nodeName && e.nodeName.toLowerCase() === t
                    }
                },
                CLASS: function(e) {
                    var t = R[e + " "];
                    return t || (t = new RegExp("(^|" + a + ")" + e + "(" + a + "|$)")) && R(e, function(e) {
                        return t.test("string" == typeof e.className && e.className || void 0 !== e.getAttribute && e.getAttribute("class") || "")
                    })
                },
                ATTR: function(t, n, i) {
                    return function(e) {
                        return null == (e = L.attr(e, t)) ? "!=" === n : !n || (e += "",
                        "=" === n ? e === i : "!=" === n ? e !== i : "^=" === n ? i && 0 === e.indexOf(i) : "*=" === n ? i && -1 < e.indexOf(i) : "$=" === n ? i && e.slice(-i.length) === i : "~=" === n ? -1 < (" " + e.replace(te, " ") + " ").indexOf(i) : "|=" === n && (e === i || e.slice(0, i.length + 1) === i + "-"))
                    }
                },
                CHILD: function(p, e, t, g, m) {
                    var v = "nth" !== p.slice(0, 3)
                      , y = "last" !== p.slice(-4)
                      , b = "of-type" === e;
                    return 1 === g && 0 === m ? function(e) {
                        return !!e.parentNode
                    }
                    : function(e, t, n) {
                        var i, o, r, s, a, l, c = v != y ? "nextSibling" : "previousSibling", u = e.parentNode, d = b && e.nodeName.toLowerCase(), h = !n && !b, f = !1;
                        if (u) {
                            if (v) {
                                for (; c; ) {
                                    for (s = e; s = s[c]; )
                                        if (b ? s.nodeName.toLowerCase() === d : 1 === s.nodeType)
                                            return !1;
                                    l = c = "only" === p && !l && "nextSibling"
                                }
                                return !0
                            }
                            if (l = [y ? u.firstChild : u.lastChild],
                            y && h) {
                                for (f = (a = (i = (o = (r = (s = u)[k] || (s[k] = {}))[s.uniqueID] || (r[s.uniqueID] = {}))[p] || [])[0] === D && i[1]) && i[2],
                                s = a && u.childNodes[a]; s = ++a && s && s[c] || (f = a = 0,
                                l.pop()); )
                                    if (1 === s.nodeType && ++f && s === e) {
                                        o[p] = [D, a, f];
                                        break
                                    }
                            } else if (!1 === (f = h ? a = (i = (o = (r = (s = e)[k] || (s[k] = {}))[s.uniqueID] || (r[s.uniqueID] = {}))[p] || [])[0] === D && i[1] : f))
                                for (; (s = ++a && s && s[c] || (f = a = 0,
                                l.pop())) && ((b ? s.nodeName.toLowerCase() !== d : 1 !== s.nodeType) || !++f || (h && ((o = (r = s[k] || (s[k] = {}))[s.uniqueID] || (r[s.uniqueID] = {}))[p] = [D, f]),
                                s !== e)); )
                                    ;
                            return (f -= m) === g || f % g == 0 && 0 <= f / g
                        }
                    }
                },
                PSEUDO: function(e, r) {
                    var t, s = x.pseudos[e] || x.setFilters[e.toLowerCase()] || L.error("unsupported pseudo: " + e);
                    return s[k] ? s(r) : 1 < s.length ? (t = [e, e, "", r],
                    x.setFilters.hasOwnProperty(e.toLowerCase()) ? P(function(e, t) {
                        for (var n, i = s(e, r), o = i.length; o--; )
                            e[n = y(e, i[o])] = !(t[n] = i[o])
                    }) : function(e) {
                        return s(e, 0, t)
                    }
                    ) : s
                }
            },
            pseudos: {
                not: P(function(e) {
                    var i = []
                      , o = []
                      , a = F(e.replace(b, "$1"));
                    return a[k] ? P(function(e, t, n, i) {
                        for (var o, r = a(e, null, i, []), s = e.length; s--; )
                            (o = r[s]) && (e[s] = !(t[s] = o))
                    }) : function(e, t, n) {
                        return i[0] = e,
                        a(i, null, n, o),
                        i[0] = null,
                        !o.pop()
                    }
                }),
                has: P(function(t) {
                    return function(e) {
                        return 0 < L(t, e).length
                    }
                }),
                contains: P(function(t) {
                    return t = t.replace(I, d),
                    function(e) {
                        return -1 < (e.textContent || r(e)).indexOf(t)
                    }
                }),
                lang: P(function(n) {
                    return se.test(n || "") || L.error("unsupported lang: " + n),
                    n = n.replace(I, d).toLowerCase(),
                    function(e) {
                        var t;
                        do {
                            if (t = S ? e.lang : e.getAttribute("xml:lang") || e.getAttribute("lang"))
                                return (t = t.toLowerCase()) === n || 0 === t.indexOf(n + "-")
                        } while ((e = e.parentNode) && 1 === e.nodeType);
                        return !1
                    }
                }),
                target: function(e) {
                    var t = H.location && H.location.hash;
                    return t && t.slice(1) === e.id
                },
                root: function(e) {
                    return e === n
                },
                focus: function(e) {
                    return e === E.activeElement && (!E.hasFocus || E.hasFocus()) && !!(e.type || e.href || ~e.tabIndex)
                },
                enabled: ge(!1),
                disabled: ge(!0),
                checked: function(e) {
                    var t = e.nodeName.toLowerCase();
                    return "input" === t && !!e.checked || "option" === t && !!e.selected
                },
                selected: function(e) {
                    return e.parentNode && e.parentNode.selectedIndex,
                    !0 === e.selected
                },
                empty: function(e) {
                    for (e = e.firstChild; e; e = e.nextSibling)
                        if (e.nodeType < 6)
                            return !1;
                    return !0
                },
                parent: function(e) {
                    return !x.pseudos.empty(e)
                },
                header: function(e) {
                    return ce.test(e.nodeName)
                },
                input: function(e) {
                    return le.test(e.nodeName)
                },
                button: function(e) {
                    var t = e.nodeName.toLowerCase();
                    return "input" === t && "button" === e.type || "button" === t
                },
                text: function(e) {
                    return "input" === e.nodeName.toLowerCase() && "text" === e.type && (null == (e = e.getAttribute("type")) || "text" === e.toLowerCase())
                },
                first: q(function() {
                    return [0]
                }),
                last: q(function(e, t) {
                    return [t - 1]
                }),
                eq: q(function(e, t, n) {
                    return [n < 0 ? n + t : n]
                }),
                even: q(function(e, t) {
                    for (var n = 0; n < t; n += 2)
                        e.push(n);
                    return e
                }),
                odd: q(function(e, t) {
                    for (var n = 1; n < t; n += 2)
                        e.push(n);
                    return e
                }),
                lt: q(function(e, t, n) {
                    for (var i = n < 0 ? n + t : t < n ? t : n; 0 <= --i; )
                        e.push(i);
                    return e
                }),
                gt: q(function(e, t, n) {
                    for (var i = n < 0 ? n + t : n; ++i < t; )
                        e.push(i);
                    return e
                })
            }
        }).pseudos.nth = x.pseudos.eq,
        {
            radio: !0,
            checkbox: !0,
            file: !0,
            password: !0,
            image: !0
        })
            x.pseudos[t] = function(t) {
                return function(e) {
                    return "input" === e.nodeName.toLowerCase() && e.type === t
                }
            }(t);
        for (t in {
            submit: !0,
            reset: !0
        })
            x.pseudos[t] = function(n) {
                return function(e) {
                    var t = e.nodeName.toLowerCase();
                    return ("input" === t || "button" === t) && e.type === n
                }
            }(t);
        function ve() {}
        function z(e) {
            for (var t = 0, n = e.length, i = ""; t < n; t++)
                i += e[t].value;
            return i
        }
        function ye(s, e, t) {
            var a = e.dir
              , l = e.next
              , c = l || a
              , u = t && "parentNode" === c
              , d = B++;
            return e.first ? function(e, t, n) {
                for (; e = e[a]; )
                    if (1 === e.nodeType || u)
                        return s(e, t, n);
                return !1
            }
            : function(e, t, n) {
                var i, o, r = [D, d];
                if (n) {
                    for (; e = e[a]; )
                        if ((1 === e.nodeType || u) && s(e, t, n))
                            return !0
                } else
                    for (; e = e[a]; )
                        if (1 === e.nodeType || u)
                            if (o = (o = e[k] || (e[k] = {}))[e.uniqueID] || (o[e.uniqueID] = {}),
                            l && l === e.nodeName.toLowerCase())
                                e = e[a] || e;
                            else {
                                if ((i = o[c]) && i[0] === D && i[1] === d)
                                    return r[2] = i[2];
                                if ((o[c] = r)[2] = s(e, t, n))
                                    return !0
                            }
                return !1
            }
        }
        function be(o) {
            return 1 < o.length ? function(e, t, n) {
                for (var i = o.length; i--; )
                    if (!o[i](e, t, n))
                        return !1;
                return !0
            }
            : o[0]
        }
        function xe(e, t, n, i, o) {
            for (var r, s = [], a = 0, l = e.length, c = null != t; a < l; a++)
                !(r = e[a]) || n && !n(r, i, o) || (s.push(r),
                c && t.push(a));
            return s
        }
        function we(e) {
            for (var i, t, n, o = e.length, r = x.relative[e[0].type], s = r || x.relative[" "], a = r ? 1 : 0, l = ye(function(e) {
                return e === i
            }, s, !0), c = ye(function(e) {
                return -1 < y(i, e)
            }, s, !0), u = [function(e, t, n) {
                return e = !r && (n || t !== w) || ((i = t).nodeType ? l : c)(e, t, n),
                i = null,
                e
            }
            ]; a < o; a++)
                if (t = x.relative[e[a].type])
                    u = [ye(be(u), t)];
                else {
                    if ((t = x.filter[e[a].type].apply(null, e[a].matches))[k]) {
                        for (n = ++a; n < o && !x.relative[e[n].type]; n++)
                            ;
                        return function e(f, p, g, m, v, t) {
                            return m && !m[k] && (m = e(m)),
                            v && !v[k] && (v = e(v, t)),
                            P(function(e, t, n, i) {
                                var o, r, s, a = [], l = [], c = t.length, u = e || function(e, t, n) {
                                    for (var i = 0, o = t.length; i < o; i++)
                                        L(e, t[i], n);
                                    return n
                                }(p || "*", n.nodeType ? [n] : n, []), d = !f || !e && p ? u : xe(u, a, f, n, i), h = g ? v || (e ? f : c || m) ? [] : t : d;
                                if (g && g(d, h, n, i),
                                m)
                                    for (o = xe(h, l),
                                    m(o, [], n, i),
                                    r = o.length; r--; )
                                        (s = o[r]) && (h[l[r]] = !(d[l[r]] = s));
                                if (e) {
                                    if (v || f) {
                                        if (v) {
                                            for (o = [],
                                            r = h.length; r--; )
                                                (s = h[r]) && o.push(d[r] = s);
                                            v(null, h = [], o, i)
                                        }
                                        for (r = h.length; r--; )
                                            (s = h[r]) && -1 < (o = v ? y(e, s) : a[r]) && (e[o] = !(t[o] = s))
                                    }
                                } else
                                    h = xe(h === t ? h.splice(c, h.length) : h),
                                    v ? v(null, t, h, i) : T.apply(t, h)
                            })
                        }(1 < a && be(u), 1 < a && z(e.slice(0, a - 1).concat({
                            value: " " === e[a - 2].type ? "*" : ""
                        })).replace(b, "$1"), t, a < n && we(e.slice(a, n)), n < o && we(e = e.slice(n)), n < o && z(e))
                    }
                    u.push(t)
                }
            return be(u)
        }
        return ve.prototype = x.filters = x.pseudos,
        x.setFilters = new ve,
        f = L.tokenize = function(e, t) {
            var n, i, o, r, s, a, l, c = U[e + " "];
            if (c)
                return t ? 0 : c.slice(0);
            for (s = e,
            a = [],
            l = x.preFilter; s; ) {
                for (r in n && !(i = ne.exec(s)) || (i && (s = s.slice(i[0].length) || s),
                a.push(o = [])),
                n = !1,
                (i = ie.exec(s)) && (n = i.shift(),
                o.push({
                    value: n,
                    type: i[0].replace(b, " ")
                }),
                s = s.slice(n.length)),
                x.filter)
                    !(i = _[r].exec(s)) || l[r] && !(i = l[r](i)) || (n = i.shift(),
                    o.push({
                        value: n,
                        type: r,
                        matches: i
                    }),
                    s = s.slice(n.length));
                if (!n)
                    break
            }
            return t ? s.length : s ? L.error(e) : U(e, a).slice(0)
        }
        ,
        F = L.compile = function(e, t) {
            var n, m, v, y, b, i, o = [], r = [], s = V[e + " "];
            if (!s) {
                for (n = (t = t || f(e)).length; n--; )
                    ((s = we(t[n]))[k] ? o : r).push(s);
                (s = V(e, (y = 0 < (v = o).length,
                b = 0 < (m = r).length,
                i = function(e, t, n, i, o) {
                    var r, s, a, l = 0, c = "0", u = e && [], d = [], h = w, f = e || b && x.find.TAG("*", o), p = D += null == h ? 1 : Math.random() || .1, g = f.length;
                    for (o && (w = t == E || t || o); c !== g && null != (r = f[c]); c++) {
                        if (b && r) {
                            for (s = 0,
                            t || r.ownerDocument == E || (C(r),
                            n = !S); a = m[s++]; )
                                if (a(r, t || E, n)) {
                                    i.push(r);
                                    break
                                }
                            o && (D = p)
                        }
                        y && ((r = !a && r) && l--,
                        e) && u.push(r)
                    }
                    if (l += c,
                    y && c !== l) {
                        for (s = 0; a = v[s++]; )
                            a(u, d, t, n);
                        if (e) {
                            if (0 < l)
                                for (; c--; )
                                    u[c] || d[c] || (d[c] = G.call(i));
                            d = xe(d)
                        }
                        T.apply(i, d),
                        o && !e && 0 < d.length && 1 < l + v.length && L.uniqueSort(i)
                    }
                    return o && (D = p,
                    w = h),
                    u
                }
                ,
                y ? P(i) : i))).selector = e
            }
            return s
        }
        ,
        W = L.select = function(e, t, n, i) {
            var o, r, s, a, l, c = "function" == typeof e && e, u = !i && f(e = c.selector || e);
            if (n = n || [],
            1 === u.length) {
                if (2 < (r = u[0] = u[0].slice(0)).length && "ID" === (s = r[0]).type && 9 === t.nodeType && S && x.relative[r[1].type]) {
                    if (!(t = (x.find.ID(s.matches[0].replace(I, d), t) || [])[0]))
                        return n;
                    c && (t = t.parentNode),
                    e = e.slice(r.shift().value.length)
                }
                for (o = _.needsContext.test(e) ? 0 : r.length; o-- && (s = r[o],
                !x.relative[a = s.type]); )
                    if ((l = x.find[a]) && (i = l(s.matches[0].replace(I, d), de.test(r[0].type) && me(t.parentNode) || t))) {
                        if (r.splice(o, 1),
                        e = i.length && z(r))
                            break;
                        return T.apply(n, i),
                        n
                    }
            }
            return (c || F(e, u))(i, t, !S, n, !t || de.test(e) && me(t.parentNode) || t),
            n
        }
        ,
        h.sortStable = k.split("").sort(X).join("") === k,
        h.detectDuplicates = !!c,
        C(),
        h.sortDetached = N(function(e) {
            return 1 & e.compareDocumentPosition(E.createElement("fieldset"))
        }),
        N(function(e) {
            return e.innerHTML = "<a href='#'></a>",
            "#" === e.firstChild.getAttribute("href")
        }) || fe("type|href|height|width", function(e, t, n) {
            if (!n)
                return e.getAttribute(t, "type" === t.toLowerCase() ? 1 : 2)
        }),
        h.attributes && N(function(e) {
            return e.innerHTML = "<input/>",
            e.firstChild.setAttribute("value", ""),
            "" === e.firstChild.getAttribute("value")
        }) || fe("value", function(e, t, n) {
            if (!n && "input" === e.nodeName.toLowerCase())
                return e.defaultValue
        }),
        N(function(e) {
            return null == e.getAttribute("disabled")
        }) || fe(K, function(e, t, n) {
            if (!n)
                return !0 === e[t] ? t.toLowerCase() : (n = e.getAttributeNode(t)) && n.specified ? n.value : null
        }),
        L
    }(C)
      , se = (S.find = x,
    S.expr = x.selectors,
    S.expr[":"] = S.expr.pseudos,
    S.uniqueSort = S.unique = x.uniqueSort,
    S.text = x.getText,
    S.isXMLDoc = x.isXML,
    S.contains = x.contains,
    S.escapeSelector = x.escape,
    S.expr.match.needsContext);
    function l(e, t) {
        return e.nodeName && e.nodeName.toLowerCase() === t.toLowerCase()
    }
    var ae = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;
    function K(e, n, i) {
        return y(n) ? S.grep(e, function(e, t) {
            return !!n.call(e, t, e) !== i
        }) : n.nodeType ? S.grep(e, function(e) {
            return e === n !== i
        }) : "string" != typeof n ? S.grep(e, function(e) {
            return -1 < V.call(n, e) !== i
        }) : S.filter(n, e, i)
    }
    S.filter = function(e, t, n) {
        var i = t[0];
        return n && (e = ":not(" + e + ")"),
        1 === t.length && 1 === i.nodeType ? S.find.matchesSelector(i, e) ? [i] : [] : S.find.matches(e, S.grep(t, function(e) {
            return 1 === e.nodeType
        }))
    }
    ,
    S.fn.extend({
        find: function(e) {
            var t, n, i = this.length, o = this;
            if ("string" != typeof e)
                return this.pushStack(S(e).filter(function() {
                    for (t = 0; t < i; t++)
                        if (S.contains(o[t], this))
                            return !0
                }));
            for (n = this.pushStack([]),
            t = 0; t < i; t++)
                S.find(e, o[t], n);
            return 1 < i ? S.uniqueSort(n) : n
        },
        filter: function(e) {
            return this.pushStack(K(this, e || [], !1))
        },
        not: function(e) {
            return this.pushStack(K(this, e || [], !0))
        },
        is: function(e) {
            return !!K(this, "string" == typeof e && se.test(e) ? S(e) : e || [], !1).length
        }
    });
    var ce, ue = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/, fe = ((S.fn.init = function(e, t, n) {
        if (e) {
            if (n = n || ce,
            "string" != typeof e)
                return e.nodeType ? (this[0] = e,
                this.length = 1,
                this) : y(e) ? void 0 !== n.ready ? n.ready(e) : e(S) : S.makeArray(e, this);
            if (!(i = "<" === e[0] && ">" === e[e.length - 1] && 3 <= e.length ? [null, e, null] : ue.exec(e)) || !i[1] && t)
                return (!t || t.jquery ? t || n : this.constructor(t)).find(e);
            if (i[1]) {
                if (t = t instanceof S ? t[0] : t,
                S.merge(this, S.parseHTML(i[1], t && t.nodeType ? t.ownerDocument || t : E, !0)),
                ae.test(i[1]) && S.isPlainObject(t))
                    for (var i in t)
                        y(this[i]) ? this[i](t[i]) : this.attr(i, t[i])
            } else
                (n = E.getElementById(i[2])) && (this[0] = n,
                this.length = 1)
        }
        return this
    }
    ).prototype = S.fn,
    ce = S(E),
    /^(?:parents|prev(?:Until|All))/), pe = {
        children: !0,
        contents: !0,
        next: !0,
        prev: !0
    };
    function ie(e, t) {
        for (; (e = e[t]) && 1 !== e.nodeType; )
            ;
        return e
    }
    S.fn.extend({
        has: function(e) {
            var t = S(e, this)
              , n = t.length;
            return this.filter(function() {
                for (var e = 0; e < n; e++)
                    if (S.contains(this, t[e]))
                        return !0
            })
        },
        closest: function(e, t) {
            var n, i = 0, o = this.length, r = [], s = "string" != typeof e && S(e);
            if (!se.test(e))
                for (; i < o; i++)
                    for (n = this[i]; n && n !== t; n = n.parentNode)
                        if (n.nodeType < 11 && (s ? -1 < s.index(n) : 1 === n.nodeType && S.find.matchesSelector(n, e))) {
                            r.push(n);
                            break
                        }
            return this.pushStack(1 < r.length ? S.uniqueSort(r) : r)
        },
        index: function(e) {
            return e ? "string" == typeof e ? V.call(S(e), this[0]) : V.call(this, e.jquery ? e[0] : e) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
        },
        add: function(e, t) {
            return this.pushStack(S.uniqueSort(S.merge(this.get(), S(e, t))))
        },
        addBack: function(e) {
            return this.add(null == e ? this.prevObject : this.prevObject.filter(e))
        }
    }),
    S.each({
        parent: function(e) {
            return (e = e.parentNode) && 11 !== e.nodeType ? e : null
        },
        parents: function(e) {
            return i(e, "parentNode")
        },
        parentsUntil: function(e, t, n) {
            return i(e, "parentNode", n)
        },
        next: function(e) {
            return ie(e, "nextSibling")
        },
        prev: function(e) {
            return ie(e, "previousSibling")
        },
        nextAll: function(e) {
            return i(e, "nextSibling")
        },
        prevAll: function(e) {
            return i(e, "previousSibling")
        },
        nextUntil: function(e, t, n) {
            return i(e, "nextSibling", n)
        },
        prevUntil: function(e, t, n) {
            return i(e, "previousSibling", n)
        },
        siblings: function(e) {
            return G((e.parentNode || {}).firstChild, e)
        },
        children: function(e) {
            return G(e.firstChild)
        },
        contents: function(e) {
            return null != e.contentDocument && B(e.contentDocument) ? e.contentDocument : (l(e, "template") && (e = e.content || e),
            S.merge([], e.childNodes))
        }
    }, function(i, o) {
        S.fn[i] = function(e, t) {
            var n = S.map(this, o, e);
            return (t = "Until" !== i.slice(-5) ? e : t) && "string" == typeof t && (n = S.filter(t, n)),
            1 < this.length && (pe[i] || S.uniqueSort(n),
            fe.test(i)) && n.reverse(),
            this.pushStack(n)
        }
    });
    var k = /[^\x20\t\r\n\f]+/g;
    function u(e) {
        return e
    }
    function oe(e) {
        throw e
    }
    function re(e, t, n, i) {
        var o;
        try {
            e && y(o = e.promise) ? o.call(e).done(t).fail(n) : e && y(o = e.then) ? o.call(e, t, n) : t.apply(void 0, [e].slice(i))
        } catch (e) {
            n.apply(void 0, [e])
        }
    }
    S.Callbacks = function(i) {
        var e, r;
        function o() {
            for (l = l || i.once,
            a = s = !0; u.length; d = -1)
                for (t = u.shift(); ++d < c.length; )
                    !1 === c[d].apply(t[0], t[1]) && i.stopOnFalse && (d = c.length,
                    t = !1);
            i.memory || (t = !1),
            s = !1,
            l && (c = t ? [] : "")
        }
        i = "string" == typeof i ? (e = i,
        r = {},
        S.each(e.match(k) || [], function(e, t) {
            r[t] = !0
        }),
        r) : S.extend({}, i);
        var s, t, a, l, c = [], u = [], d = -1, h = {
            add: function() {
                return c && (t && !s && (d = c.length - 1,
                u.push(t)),
                function n(e) {
                    S.each(e, function(e, t) {
                        y(t) ? i.unique && h.has(t) || c.push(t) : t && t.length && "string" !== p(t) && n(t)
                    })
                }(arguments),
                t) && !s && o(),
                this
            },
            remove: function() {
                return S.each(arguments, function(e, t) {
                    for (var n; -1 < (n = S.inArray(t, c, n)); )
                        c.splice(n, 1),
                        n <= d && d--
                }),
                this
            },
            has: function(e) {
                return e ? -1 < S.inArray(e, c) : 0 < c.length
            },
            empty: function() {
                return c = c && [],
                this
            },
            disable: function() {
                return l = u = [],
                c = t = "",
                this
            },
            disabled: function() {
                return !c
            },
            lock: function() {
                return l = u = [],
                t || s || (c = t = ""),
                this
            },
            locked: function() {
                return !!l
            },
            fireWith: function(e, t) {
                return l || (t = [e, (t = t || []).slice ? t.slice() : t],
                u.push(t),
                s) || o(),
                this
            },
            fire: function() {
                return h.fireWith(this, arguments),
                this
            },
            fired: function() {
                return !!a
            }
        };
        return h
    }
    ,
    S.extend({
        Deferred: function(e) {
            var r = [["notify", "progress", S.Callbacks("memory"), S.Callbacks("memory"), 2], ["resolve", "done", S.Callbacks("once memory"), S.Callbacks("once memory"), 0, "resolved"], ["reject", "fail", S.Callbacks("once memory"), S.Callbacks("once memory"), 1, "rejected"]]
              , o = "pending"
              , s = {
                state: function() {
                    return o
                },
                always: function() {
                    return a.done(arguments).fail(arguments),
                    this
                },
                catch: function(e) {
                    return s.then(null, e)
                },
                pipe: function() {
                    var o = arguments;
                    return S.Deferred(function(i) {
                        S.each(r, function(e, t) {
                            var n = y(o[t[4]]) && o[t[4]];
                            a[t[1]](function() {
                                var e = n && n.apply(this, arguments);
                                e && y(e.promise) ? e.promise().progress(i.notify).done(i.resolve).fail(i.reject) : i[t[0] + "With"](this, n ? [e] : arguments)
                            })
                        }),
                        o = null
                    }).promise()
                },
                then: function(t, n, i) {
                    var l = 0;
                    function c(o, r, s, a) {
                        return function() {
                            function e() {
                                var e, t;
                                if (!(o < l)) {
                                    if ((e = s.apply(n, i)) === r.promise())
                                        throw new TypeError("Thenable self-resolution");
                                    y(t = e && ("object" == typeof e || "function" == typeof e) && e.then) ? a ? t.call(e, c(l, r, u, a), c(l, r, oe, a)) : (l++,
                                    t.call(e, c(l, r, u, a), c(l, r, oe, a), c(l, r, u, r.notifyWith))) : (s !== u && (n = void 0,
                                    i = [e]),
                                    (a || r.resolveWith)(n, i))
                                }
                            }
                            var n = this
                              , i = arguments
                              , t = a ? e : function() {
                                try {
                                    e()
                                } catch (e) {
                                    S.Deferred.exceptionHook && S.Deferred.exceptionHook(e, t.stackTrace),
                                    l <= o + 1 && (s !== oe && (n = void 0,
                                    i = [e]),
                                    r.rejectWith(n, i))
                                }
                            }
                            ;
                            o ? t() : (S.Deferred.getStackHook && (t.stackTrace = S.Deferred.getStackHook()),
                            C.setTimeout(t))
                        }
                    }
                    return S.Deferred(function(e) {
                        r[0][3].add(c(0, e, y(i) ? i : u, e.notifyWith)),
                        r[1][3].add(c(0, e, y(t) ? t : u)),
                        r[2][3].add(c(0, e, y(n) ? n : oe))
                    }).promise()
                },
                promise: function(e) {
                    return null != e ? S.extend(e, s) : s
                }
            }
              , a = {};
            return S.each(r, function(e, t) {
                var n = t[2]
                  , i = t[5];
                s[t[1]] = n.add,
                i && n.add(function() {
                    o = i
                }, r[3 - e][2].disable, r[3 - e][3].disable, r[0][2].lock, r[0][3].lock),
                n.add(t[3].fire),
                a[t[0]] = function() {
                    return a[t[0] + "With"](this === a ? void 0 : this, arguments),
                    this
                }
                ,
                a[t[0] + "With"] = n.fireWith
            }),
            s.promise(a),
            e && e.call(a, a),
            a
        },
        when: function(e) {
            function t(t) {
                return function(e) {
                    o[t] = this,
                    r[t] = 1 < arguments.length ? h.call(arguments) : e,
                    --n || s.resolveWith(o, r)
                }
            }
            var n = arguments.length
              , i = n
              , o = Array(i)
              , r = h.call(arguments)
              , s = S.Deferred();
            if (n <= 1 && (re(e, s.done(t(i)).resolve, s.reject, !n),
            "pending" === s.state() || y(r[i] && r[i].then)))
                return s.then();
            for (; i--; )
                re(r[i], t(i), s.reject);
            return s.promise()
        }
    });
    var ve = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/
      , ye = (S.Deferred.exceptionHook = function(e, t) {
        C.console && C.console.warn && e && ve.test(e.name) && C.console.warn("jQuery.Deferred exception: " + e.message, e.stack, t)
    }
    ,
    S.readyException = function(e) {
        C.setTimeout(function() {
            throw e
        })
    }
    ,
    S.Deferred());
    function le() {
        E.removeEventListener("DOMContentLoaded", le),
        C.removeEventListener("load", le),
        S.ready()
    }
    function d(e, t, n, i, o, r, s) {
        var a = 0
          , l = e.length
          , c = null == n;
        if ("object" === p(n))
            for (a in o = !0,
            n)
                d(e, t, a, n[a], !0, r, s);
        else if (void 0 !== i && (o = !0,
        y(i) || (s = !0),
        t = c ? s ? (t.call(e, i),
        null) : (c = t,
        function(e, t, n) {
            return c.call(S(e), n)
        }
        ) : t))
            for (; a < l; a++)
                t(e[a], n, s ? i : i.call(e[a], a, t(e[a], n)));
        return o ? e : c ? t.call(e) : l ? t(e[0], n) : r
    }
    S.fn.ready = function(e) {
        return ye.then(e).catch(function(e) {
            S.readyException(e)
        }),
        this
    }
    ,
    S.extend({
        isReady: !1,
        readyWait: 1,
        ready: function(e) {
            (!0 === e ? --S.readyWait : S.isReady) || (S.isReady = !0) !== e && 0 < --S.readyWait || ye.resolveWith(E, [S])
        }
    }),
    S.ready.then = ye.then,
    "complete" === E.readyState || "loading" !== E.readyState && !E.documentElement.doScroll ? C.setTimeout(S.ready) : (E.addEventListener("DOMContentLoaded", le),
    C.addEventListener("load", le));
    var xe = /^-ms-/
      , we = /-([a-z])/g;
    function de(e, t) {
        return t.toUpperCase()
    }
    function b(e) {
        return e.replace(xe, "ms-").replace(we, de)
    }
    function v(e) {
        return 1 === e.nodeType || 9 === e.nodeType || !+e.nodeType
    }
    function he() {
        this.expando = S.expando + he.uid++
    }
    he.uid = 1,
    he.prototype = {
        cache: function(e) {
            var t = e[this.expando];
            return t || (t = {},
            v(e) && (e.nodeType ? e[this.expando] = t : Object.defineProperty(e, this.expando, {
                value: t,
                configurable: !0
            }))),
            t
        },
        set: function(e, t, n) {
            var i, o = this.cache(e);
            if ("string" == typeof t)
                o[b(t)] = n;
            else
                for (i in t)
                    o[b(i)] = t[i];
            return o
        },
        get: function(e, t) {
            return void 0 === t ? this.cache(e) : e[this.expando] && e[this.expando][b(t)]
        },
        access: function(e, t, n) {
            return void 0 === t || t && "string" == typeof t && void 0 === n ? this.get(e, t) : (this.set(e, t, n),
            void 0 !== n ? n : t)
        },
        remove: function(e, t) {
            var n, i = e[this.expando];
            if (void 0 !== i) {
                if (void 0 !== t) {
                    n = (t = Array.isArray(t) ? t.map(b) : (t = b(t))in i ? [t] : t.match(k) || []).length;
                    for (; n--; )
                        delete i[t[n]]
                }
                void 0 !== t && !S.isEmptyObject(i) || (e.nodeType ? e[this.expando] = void 0 : delete e[this.expando])
            }
        },
        hasData: function(e) {
            return void 0 !== (e = e[this.expando]) && !S.isEmptyObject(e)
        }
    };
    var D = new he
      , A = new he
      , Ce = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/
      , Ee = /[A-Z]/g;
    function ge(e, t, n) {
        var i, o;
        if (void 0 === n && 1 === e.nodeType)
            if (i = "data-" + t.replace(Ee, "-$&").toLowerCase(),
            "string" == typeof (n = e.getAttribute(i))) {
                try {
                    n = "true" === (o = n) || "false" !== o && ("null" === o ? null : o === +o + "" ? +o : Ce.test(o) ? JSON.parse(o) : o)
                } catch (e) {}
                A.set(e, t, n)
            } else
                n = void 0;
        return n
    }
    function me(e, t) {
        return "none" === (e = t || e).style.display || "" === e.style.display && I(e) && "none" === S.css(e, "display")
    }
    S.extend({
        hasData: function(e) {
            return A.hasData(e) || D.hasData(e)
        },
        data: function(e, t, n) {
            return A.access(e, t, n)
        },
        removeData: function(e, t) {
            A.remove(e, t)
        },
        _data: function(e, t, n) {
            return D.access(e, t, n)
        },
        _removeData: function(e, t) {
            D.remove(e, t)
        }
    }),
    S.fn.extend({
        data: function(n, e) {
            var t, i, o, r = this[0], s = r && r.attributes;
            if (void 0 !== n)
                return "object" == typeof n ? this.each(function() {
                    A.set(this, n)
                }) : d(this, function(e) {
                    var t;
                    if (r && void 0 === e)
                        return void 0 !== (t = A.get(r, n)) || void 0 !== (t = ge(r, n)) ? t : void 0;
                    this.each(function() {
                        A.set(this, n, e)
                    })
                }, null, e, 1 < arguments.length, null, !0);
            if (this.length && (o = A.get(r),
            1 === r.nodeType) && !D.get(r, "hasDataAttrs")) {
                for (t = s.length; t--; )
                    s[t] && 0 === (i = s[t].name).indexOf("data-") && (i = b(i.slice(5)),
                    ge(r, i, o[i]));
                D.set(r, "hasDataAttrs", !0)
            }
            return o
        },
        removeData: function(e) {
            return this.each(function() {
                A.remove(this, e)
            })
        }
    }),
    S.extend({
        queue: function(e, t, n) {
            var i;
            if (e)
                return i = D.get(e, t = (t || "fx") + "queue"),
                n && (!i || Array.isArray(n) ? i = D.access(e, t, S.makeArray(n)) : i.push(n)),
                i || []
        },
        dequeue: function(e, t) {
            t = t || "fx";
            var n = S.queue(e, t)
              , i = n.length
              , o = n.shift()
              , r = S._queueHooks(e, t);
            "inprogress" === o && (o = n.shift(),
            i--),
            o && ("fx" === t && n.unshift("inprogress"),
            delete r.stop,
            o.call(e, function() {
                S.dequeue(e, t)
            }, r)),
            !i && r && r.empty.fire()
        },
        _queueHooks: function(e, t) {
            var n = t + "queueHooks";
            return D.get(e, n) || D.access(e, n, {
                empty: S.Callbacks("once memory").add(function() {
                    D.remove(e, [t + "queue", n])
                })
            })
        }
    }),
    S.fn.extend({
        queue: function(t, n) {
            var e = 2;
            return "string" != typeof t && (n = t,
            t = "fx",
            e--),
            arguments.length < e ? S.queue(this[0], t) : void 0 === n ? this : this.each(function() {
                var e = S.queue(this, t, n);
                S._queueHooks(this, t),
                "fx" === t && "inprogress" !== e[0] && S.dequeue(this, t)
            })
        },
        dequeue: function(e) {
            return this.each(function() {
                S.dequeue(this, e)
            })
        },
        clearQueue: function(e) {
            return this.queue(e || "fx", [])
        },
        promise: function(e, t) {
            function n() {
                --o || r.resolveWith(s, [s])
            }
            var i, o = 1, r = S.Deferred(), s = this, a = this.length;
            for ("string" != typeof e && (t = e,
            e = void 0),
            e = e || "fx"; a--; )
                (i = D.get(s[a], e + "queueHooks")) && i.empty && (o++,
                i.empty.add(n));
            return n(),
            r.promise(t)
        }
    });
    var x = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source
      , ke = new RegExp("^(?:([+-])=|)(" + x + ")([a-z%]*)$","i")
      , j = ["Top", "Right", "Bottom", "Left"]
      , P = E.documentElement
      , I = function(e) {
        return S.contains(e.ownerDocument, e)
    }
      , Te = {
        composed: !0
    };
    function be(e, t, n, i) {
        var o, r, s = 20, a = i ? function() {
            return i.cur()
        }
        : function() {
            return S.css(e, t, "")
        }
        , l = a(), c = n && n[3] || (S.cssNumber[t] ? "" : "px"), u = e.nodeType && (S.cssNumber[t] || "px" !== c && +l) && ke.exec(S.css(e, t));
        if (u && u[3] !== c) {
            for (c = c || u[3],
            u = (l /= 2) || 1; s--; )
                S.style(e, t, u + c),
                (1 - r) * (1 - (r = a() / l || .5)) <= 0 && (s = 0),
                u /= r;
            S.style(e, t, (u *= 2) + c),
            n = n || []
        }
        return n && (u = +u || +l || 0,
        o = n[1] ? u + (n[1] + 1) * n[2] : +n[2],
        i) && (i.unit = c,
        i.start = u,
        i.end = o),
        o
    }
    P.getRootNode && (I = function(e) {
        return S.contains(e.ownerDocument, e) || e.getRootNode(Te) === e.ownerDocument
    }
    );
    var Ne = {};
    function T(e, t) {
        for (var n, i, o, r, s, a, l = [], c = 0, u = e.length; c < u; c++)
            (i = e[c]).style && (n = i.style.display,
            t ? ("none" === n && (l[c] = D.get(i, "display") || null,
            l[c] || (i.style.display = "")),
            "" === i.style.display && me(i) && (l[c] = (a = r = o = void 0,
            r = i.ownerDocument,
            s = i.nodeName,
            (a = Ne[s]) || (o = r.body.appendChild(r.createElement(s)),
            a = S.css(o, "display"),
            o.parentNode.removeChild(o),
            Ne[s] = a = "none" === a ? "block" : a)))) : "none" !== n && (l[c] = "none",
            D.set(i, "display", n)));
        for (c = 0; c < u; c++)
            null != l[c] && (e[c].style.display = l[c]);
        return e
    }
    S.fn.extend({
        show: function() {
            return T(this, !0)
        },
        hide: function() {
            return T(this)
        },
        toggle: function(e) {
            return "boolean" == typeof e ? e ? this.show() : this.hide() : this.each(function() {
                me(this) ? S(this).show() : S(this).hide()
            })
        }
    });
    var je = /^(?:checkbox|radio)$/i
      , Pe = /<([a-z][^\/\0>\x20\t\r\n\f]*)/i
      , Fe = /^$|^module$|\/(?:java|ecma)script/i
      , M = E.createDocumentFragment().appendChild(E.createElement("div"))
      , O = ((F = E.createElement("input")).setAttribute("type", "radio"),
    F.setAttribute("checked", "checked"),
    F.setAttribute("name", "t"),
    M.appendChild(F),
    m.checkClone = M.cloneNode(!0).cloneNode(!0).lastChild.checked,
    M.innerHTML = "<textarea>x</textarea>",
    m.noCloneChecked = !!M.cloneNode(!0).lastChild.defaultValue,
    M.innerHTML = "<option></option>",
    m.option = !!M.lastChild,
    {
        thead: [1, "<table>", "</table>"],
        col: [2, "<table><colgroup>", "</colgroup></table>"],
        tr: [2, "<table><tbody>", "</tbody></table>"],
        td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
        _default: [0, "", ""]
    });
    function _(e, t) {
        var n = void 0 !== e.getElementsByTagName ? e.getElementsByTagName(t || "*") : void 0 !== e.querySelectorAll ? e.querySelectorAll(t || "*") : [];
        return void 0 === t || t && l(e, t) ? S.merge([e], n) : n
    }
    function Se(e, t) {
        for (var n = 0, i = e.length; n < i; n++)
            D.set(e[n], "globalEval", !t || D.get(t[n], "globalEval"))
    }
    O.tbody = O.tfoot = O.colgroup = O.caption = O.thead,
    O.th = O.td,
    m.option || (O.optgroup = O.option = [1, "<select multiple='multiple'>", "</select>"]);
    var We = /<|&#?\w+;/;
    function De(e, t, n, i, o) {
        for (var r, s, a, l, c, u = t.createDocumentFragment(), d = [], h = 0, f = e.length; h < f; h++)
            if ((r = e[h]) || 0 === r)
                if ("object" === p(r))
                    S.merge(d, r.nodeType ? [r] : r);
                else if (We.test(r)) {
                    for (s = s || u.appendChild(t.createElement("div")),
                    a = (Pe.exec(r) || ["", ""])[1].toLowerCase(),
                    a = O[a] || O._default,
                    s.innerHTML = a[1] + S.htmlPrefilter(r) + a[2],
                    c = a[0]; c--; )
                        s = s.lastChild;
                    S.merge(d, s.childNodes),
                    (s = u.firstChild).textContent = ""
                } else
                    d.push(t.createTextNode(r));
        for (u.textContent = "",
        h = 0; r = d[h++]; )
            if (i && -1 < S.inArray(r, i))
                o && o.push(r);
            else if (l = I(r),
            s = _(u.appendChild(r), "script"),
            l && Se(s),
            n)
                for (c = 0; r = s[c++]; )
                    Fe.test(r.type || "") && n.push(r);
        return u
    }
    var Be = /^([^.]*)(?:\.(.+)|)/;
    function s() {
        return !0
    }
    function f() {
        return !1
    }
    function Ae(e, t) {
        return e === function() {
            try {
                return E.activeElement
            } catch (e) {}
        }() == ("focus" === t)
    }
    function _e(e, t, n, i, o, r) {
        var s, a;
        if ("object" == typeof t) {
            for (a in "string" != typeof n && (i = i || n,
            n = void 0),
            t)
                _e(e, a, n, i, t[a], r);
            return e
        }
        if (null == i && null == o ? (o = n,
        i = n = void 0) : null == o && ("string" == typeof n ? (o = i,
        i = void 0) : (o = i,
        i = n,
        n = void 0)),
        !1 === o)
            o = f;
        else if (!o)
            return e;
        return 1 === r && (s = o,
        (o = function(e) {
            return S().off(e),
            s.apply(this, arguments)
        }
        ).guid = s.guid || (s.guid = S.guid++)),
        e.each(function() {
            S.event.add(this, t, o, i, n)
        })
    }
    function Le(e, o, r) {
        r ? (D.set(e, o, !1),
        S.event.add(e, o, {
            namespace: !1,
            handler: function(e) {
                var t, n, i = D.get(this, o);
                if (1 & e.isTrigger && this[o]) {
                    if (i.length)
                        (S.event.special[o] || {}).delegateType && e.stopPropagation();
                    else if (i = h.call(arguments),
                    D.set(this, o, i),
                    t = r(this, o),
                    this[o](),
                    i !== (n = D.get(this, o)) || t ? D.set(this, o, !1) : n = {},
                    i !== n)
                        return e.stopImmediatePropagation(),
                        e.preventDefault(),
                        n && n.value
                } else
                    i.length && (D.set(this, o, {
                        value: S.event.trigger(S.extend(i[0], S.Event.prototype), i.slice(1), this)
                    }),
                    e.stopImmediatePropagation())
            }
        })) : void 0 === D.get(e, o) && S.event.add(e, o, s)
    }
    S.event = {
        global: {},
        add: function(t, e, n, i, o) {
            var r, s, a, l, c, u, d, h, f, p = D.get(t);
            if (v(t))
                for (n.handler && (n = (r = n).handler,
                o = r.selector),
                o && S.find.matchesSelector(P, o),
                n.guid || (n.guid = S.guid++),
                a = (a = p.events) || (p.events = Object.create(null)),
                s = (s = p.handle) || (p.handle = function(e) {
                    return void 0 !== S && S.event.triggered !== e.type ? S.event.dispatch.apply(t, arguments) : void 0
                }
                ),
                l = (e = (e || "").match(k) || [""]).length; l--; )
                    d = f = (h = Be.exec(e[l]) || [])[1],
                    h = (h[2] || "").split(".").sort(),
                    d && (c = S.event.special[d] || {},
                    d = (o ? c.delegateType : c.bindType) || d,
                    c = S.event.special[d] || {},
                    f = S.extend({
                        type: d,
                        origType: f,
                        data: i,
                        handler: n,
                        guid: n.guid,
                        selector: o,
                        needsContext: o && S.expr.match.needsContext.test(o),
                        namespace: h.join(".")
                    }, r),
                    (u = a[d]) || ((u = a[d] = []).delegateCount = 0,
                    c.setup && !1 !== c.setup.call(t, i, h, s)) || t.addEventListener && t.addEventListener(d, s),
                    c.add && (c.add.call(t, f),
                    f.handler.guid || (f.handler.guid = n.guid)),
                    o ? u.splice(u.delegateCount++, 0, f) : u.push(f),
                    S.event.global[d] = !0)
        },
        remove: function(e, t, n, i, o) {
            var r, s, a, l, c, u, d, h, f, p, g, m = D.hasData(e) && D.get(e);
            if (m && (l = m.events)) {
                for (c = (t = (t || "").match(k) || [""]).length; c--; )
                    if (f = g = (a = Be.exec(t[c]) || [])[1],
                    p = (a[2] || "").split(".").sort(),
                    f) {
                        for (d = S.event.special[f] || {},
                        h = l[f = (i ? d.delegateType : d.bindType) || f] || [],
                        a = a[2] && new RegExp("(^|\\.)" + p.join("\\.(?:.*\\.|)") + "(\\.|$)"),
                        s = r = h.length; r--; )
                            u = h[r],
                            !o && g !== u.origType || n && n.guid !== u.guid || a && !a.test(u.namespace) || i && i !== u.selector && ("**" !== i || !u.selector) || (h.splice(r, 1),
                            u.selector && h.delegateCount--,
                            d.remove && d.remove.call(e, u));
                        s && !h.length && (d.teardown && !1 !== d.teardown.call(e, p, m.handle) || S.removeEvent(e, f, m.handle),
                        delete l[f])
                    } else
                        for (f in l)
                            S.event.remove(e, f + t[c], n, i, !0);
                S.isEmptyObject(l) && D.remove(e, "handle events")
            }
        },
        dispatch: function(e) {
            var t, n, i, o, r, s = new Array(arguments.length), a = S.event.fix(e), e = (D.get(this, "events") || Object.create(null))[a.type] || [], l = S.event.special[a.type] || {};
            for (s[0] = a,
            t = 1; t < arguments.length; t++)
                s[t] = arguments[t];
            if (a.delegateTarget = this,
            !l.preDispatch || !1 !== l.preDispatch.call(this, a)) {
                for (r = S.event.handlers.call(this, a, e),
                t = 0; (i = r[t++]) && !a.isPropagationStopped(); )
                    for (a.currentTarget = i.elem,
                    n = 0; (o = i.handlers[n++]) && !a.isImmediatePropagationStopped(); )
                        a.rnamespace && !1 !== o.namespace && !a.rnamespace.test(o.namespace) || (a.handleObj = o,
                        a.data = o.data,
                        void 0 !== (o = ((S.event.special[o.origType] || {}).handle || o.handler).apply(i.elem, s)) && !1 === (a.result = o) && (a.preventDefault(),
                        a.stopPropagation()));
                return l.postDispatch && l.postDispatch.call(this, a),
                a.result
            }
        },
        handlers: function(e, t) {
            var n, i, o, r, s, a = [], l = t.delegateCount, c = e.target;
            if (l && c.nodeType && !("click" === e.type && 1 <= e.button))
                for (; c !== this; c = c.parentNode || this)
                    if (1 === c.nodeType && ("click" !== e.type || !0 !== c.disabled)) {
                        for (r = [],
                        s = {},
                        n = 0; n < l; n++)
                            void 0 === s[o = (i = t[n]).selector + " "] && (s[o] = i.needsContext ? -1 < S(o, this).index(c) : S.find(o, this, null, [c]).length),
                            s[o] && r.push(i);
                        r.length && a.push({
                            elem: c,
                            handlers: r
                        })
                    }
            return c = this,
            l < t.length && a.push({
                elem: c,
                handlers: t.slice(l)
            }),
            a
        },
        addProp: function(t, e) {
            Object.defineProperty(S.Event.prototype, t, {
                enumerable: !0,
                configurable: !0,
                get: y(e) ? function() {
                    if (this.originalEvent)
                        return e(this.originalEvent)
                }
                : function() {
                    if (this.originalEvent)
                        return this.originalEvent[t]
                }
                ,
                set: function(e) {
                    Object.defineProperty(this, t, {
                        enumerable: !0,
                        configurable: !0,
                        writable: !0,
                        value: e
                    })
                }
            })
        },
        fix: function(e) {
            return e[S.expando] ? e : new S.Event(e)
        },
        special: {
            load: {
                noBubble: !0
            },
            click: {
                setup: function(e) {
                    return je.test((e = this || e).type) && e.click && l(e, "input") && Le(e, "click", s),
                    !1
                },
                trigger: function(e) {
                    return je.test((e = this || e).type) && e.click && l(e, "input") && Le(e, "click"),
                    !0
                },
                _default: function(e) {
                    return e = e.target,
                    je.test(e.type) && e.click && l(e, "input") && D.get(e, "click") || l(e, "a")
                }
            },
            beforeunload: {
                postDispatch: function(e) {
                    void 0 !== e.result && e.originalEvent && (e.originalEvent.returnValue = e.result)
                }
            }
        }
    },
    S.removeEvent = function(e, t, n) {
        e.removeEventListener && e.removeEventListener(t, n)
    }
    ,
    S.Event = function(e, t) {
        if (!(this instanceof S.Event))
            return new S.Event(e,t);
        e && e.type ? (this.originalEvent = e,
        this.type = e.type,
        this.isDefaultPrevented = e.defaultPrevented || void 0 === e.defaultPrevented && !1 === e.returnValue ? s : f,
        this.target = e.target && 3 === e.target.nodeType ? e.target.parentNode : e.target,
        this.currentTarget = e.currentTarget,
        this.relatedTarget = e.relatedTarget) : this.type = e,
        t && S.extend(this, t),
        this.timeStamp = e && e.timeStamp || Date.now(),
        this[S.expando] = !0
    }
    ,
    S.Event.prototype = {
        constructor: S.Event,
        isDefaultPrevented: f,
        isPropagationStopped: f,
        isImmediatePropagationStopped: f,
        isSimulated: !1,
        preventDefault: function() {
            var e = this.originalEvent;
            this.isDefaultPrevented = s,
            e && !this.isSimulated && e.preventDefault()
        },
        stopPropagation: function() {
            var e = this.originalEvent;
            this.isPropagationStopped = s,
            e && !this.isSimulated && e.stopPropagation()
        },
        stopImmediatePropagation: function() {
            var e = this.originalEvent;
            this.isImmediatePropagationStopped = s,
            e && !this.isSimulated && e.stopImmediatePropagation(),
            this.stopPropagation()
        }
    },
    S.each({
        altKey: !0,
        bubbles: !0,
        cancelable: !0,
        changedTouches: !0,
        ctrlKey: !0,
        detail: !0,
        eventPhase: !0,
        metaKey: !0,
        pageX: !0,
        pageY: !0,
        shiftKey: !0,
        view: !0,
        char: !0,
        code: !0,
        charCode: !0,
        key: !0,
        keyCode: !0,
        button: !0,
        buttons: !0,
        clientX: !0,
        clientY: !0,
        offsetX: !0,
        offsetY: !0,
        pointerId: !0,
        pointerType: !0,
        screenX: !0,
        screenY: !0,
        targetTouches: !0,
        toElement: !0,
        touches: !0,
        which: !0
    }, S.event.addProp),
    S.each({
        focus: "focusin",
        blur: "focusout"
    }, function(e, t) {
        S.event.special[e] = {
            setup: function() {
                return Le(this, e, Ae),
                !1
            },
            trigger: function() {
                return Le(this, e),
                !0
            },
            _default: function() {
                return !0
            },
            delegateType: t
        }
    }),
    S.each({
        mouseenter: "mouseover",
        mouseleave: "mouseout",
        pointerenter: "pointerover",
        pointerleave: "pointerout"
    }, function(e, o) {
        S.event.special[e] = {
            delegateType: o,
            bindType: o,
            handle: function(e) {
                var t, n = e.relatedTarget, i = e.handleObj;
                return n && (n === this || S.contains(this, n)) || (e.type = i.origType,
                t = i.handler.apply(this, arguments),
                e.type = o),
                t
            }
        }
    }),
    S.fn.extend({
        on: function(e, t, n, i) {
            return _e(this, e, t, n, i)
        },
        one: function(e, t, n, i) {
            return _e(this, e, t, n, i, 1)
        },
        off: function(e, t, n) {
            var i, o;
            if (e && e.preventDefault && e.handleObj)
                i = e.handleObj,
                S(e.delegateTarget).off(i.namespace ? i.origType + "." + i.namespace : i.origType, i.selector, i.handler);
            else {
                if ("object" != typeof e)
                    return !1 !== t && "function" != typeof t || (n = t,
                    t = void 0),
                    !1 === n && (n = f),
                    this.each(function() {
                        S.event.remove(this, e, n, t)
                    });
                for (o in e)
                    this.off(o, t, e[o])
            }
            return this
        }
    });
    var Re = /<script|<style|<link/i
      , Ue = /checked\s*(?:[^=]|=\s*.checked.)/i
      , Ve = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;
    function qe(e, t) {
        return l(e, "table") && l(11 !== t.nodeType ? t : t.firstChild, "tr") && S(e).children("tbody")[0] || e
    }
    function ze(e) {
        return e.type = (null !== e.getAttribute("type")) + "/" + e.type,
        e
    }
    function Ie(e) {
        return "true/" === (e.type || "").slice(0, 5) ? e.type = e.type.slice(5) : e.removeAttribute("type"),
        e
    }
    function Me(e, t) {
        var n, i, o, r;
        if (1 === t.nodeType) {
            if (D.hasData(e) && (r = D.get(e).events))
                for (o in D.remove(t, "handle events"),
                r)
                    for (n = 0,
                    i = r[o].length; n < i; n++)
                        S.event.add(t, o, r[o][n]);
            A.hasData(e) && (e = A.access(e),
            e = S.extend({}, e),
            A.set(t, e))
        }
    }
    function L(n, i, o, r) {
        i = R(i);
        var e, t, s, a, l, c, u = 0, d = n.length, h = d - 1, f = i[0], p = y(f);
        if (p || 1 < d && "string" == typeof f && !m.checkClone && Ue.test(f))
            return n.each(function(e) {
                var t = n.eq(e);
                p && (i[0] = f.call(this, e, t.html())),
                L(t, i, o, r)
            });
        if (d && (t = (e = De(i, n[0].ownerDocument, !1, n, r)).firstChild,
        1 === e.childNodes.length && (e = t),
        t || r)) {
            for (a = (s = S.map(_(e, "script"), ze)).length; u < d; u++)
                l = e,
                u !== h && (l = S.clone(l, !0, !0),
                a) && S.merge(s, _(l, "script")),
                o.call(n[u], l, u);
            if (a)
                for (c = s[s.length - 1].ownerDocument,
                S.map(s, Ie),
                u = 0; u < a; u++)
                    l = s[u],
                    Fe.test(l.type || "") && !D.access(l, "globalEval") && S.contains(c, l) && (l.src && "module" !== (l.type || "").toLowerCase() ? S._evalUrl && !l.noModule && S._evalUrl(l.src, {
                        nonce: l.nonce || l.getAttribute("nonce")
                    }, c) : X(l.textContent.replace(Ve, ""), l, c))
        }
        return n
    }
    function Oe(e, t, n) {
        for (var i, o = t ? S.filter(t, e) : e, r = 0; null != (i = o[r]); r++)
            n || 1 !== i.nodeType || S.cleanData(_(i)),
            i.parentNode && (n && I(i) && Se(_(i, "script")),
            i.parentNode.removeChild(i));
        return e
    }
    function He(e) {
        var t = e.ownerDocument.defaultView;
        return (t = t && t.opener ? t : C).getComputedStyle(e)
    }
    function $e(e, t, n) {
        var i, o = {};
        for (i in t)
            o[i] = e.style[i],
            e.style[i] = t[i];
        for (i in n = n.call(e),
        t)
            e.style[i] = o[i];
        return n
    }
    S.extend({
        htmlPrefilter: function(e) {
            return e
        },
        clone: function(e, t, n) {
            var i, o, r, s, a, l, c, u = e.cloneNode(!0), d = I(e);
            if (!(m.noCloneChecked || 1 !== e.nodeType && 11 !== e.nodeType || S.isXMLDoc(e)))
                for (s = _(u),
                i = 0,
                o = (r = _(e)).length; i < o; i++)
                    a = r[i],
                    "input" === (c = (l = s[i]).nodeName.toLowerCase()) && je.test(a.type) ? l.checked = a.checked : "input" !== c && "textarea" !== c || (l.defaultValue = a.defaultValue);
            if (t)
                if (n)
                    for (r = r || _(e),
                    s = s || _(u),
                    i = 0,
                    o = r.length; i < o; i++)
                        Me(r[i], s[i]);
                else
                    Me(e, u);
            return 0 < (s = _(u, "script")).length && Se(s, !d && _(e, "script")),
            u
        },
        cleanData: function(e) {
            for (var t, n, i, o = S.event.special, r = 0; void 0 !== (n = e[r]); r++)
                if (v(n)) {
                    if (t = n[D.expando]) {
                        if (t.events)
                            for (i in t.events)
                                o[i] ? S.event.remove(n, i) : S.removeEvent(n, i, t.handle);
                        n[D.expando] = void 0
                    }
                    n[A.expando] && (n[A.expando] = void 0)
                }
        }
    }),
    S.fn.extend({
        detach: function(e) {
            return Oe(this, e, !0)
        },
        remove: function(e) {
            return Oe(this, e)
        },
        text: function(e) {
            return d(this, function(e) {
                return void 0 === e ? S.text(this) : this.empty().each(function() {
                    1 !== this.nodeType && 11 !== this.nodeType && 9 !== this.nodeType || (this.textContent = e)
                })
            }, null, e, arguments.length)
        },
        append: function() {
            return L(this, arguments, function(e) {
                1 !== this.nodeType && 11 !== this.nodeType && 9 !== this.nodeType || qe(this, e).appendChild(e)
            })
        },
        prepend: function() {
            return L(this, arguments, function(e) {
                var t;
                1 !== this.nodeType && 11 !== this.nodeType && 9 !== this.nodeType || (t = qe(this, e)).insertBefore(e, t.firstChild)
            })
        },
        before: function() {
            return L(this, arguments, function(e) {
                this.parentNode && this.parentNode.insertBefore(e, this)
            })
        },
        after: function() {
            return L(this, arguments, function(e) {
                this.parentNode && this.parentNode.insertBefore(e, this.nextSibling)
            })
        },
        empty: function() {
            for (var e, t = 0; null != (e = this[t]); t++)
                1 === e.nodeType && (S.cleanData(_(e, !1)),
                e.textContent = "");
            return this
        },
        clone: function(e, t) {
            return e = null != e && e,
            t = null == t ? e : t,
            this.map(function() {
                return S.clone(this, e, t)
            })
        },
        html: function(e) {
            return d(this, function(e) {
                var t = this[0] || {}
                  , n = 0
                  , i = this.length;
                if (void 0 === e && 1 === t.nodeType)
                    return t.innerHTML;
                if ("string" == typeof e && !Re.test(e) && !O[(Pe.exec(e) || ["", ""])[1].toLowerCase()]) {
                    e = S.htmlPrefilter(e);
                    try {
                        for (; n < i; n++)
                            1 === (t = this[n] || {}).nodeType && (S.cleanData(_(t, !1)),
                            t.innerHTML = e);
                        t = 0
                    } catch (e) {}
                }
                t && this.empty().append(e)
            }, null, e, arguments.length)
        },
        replaceWith: function() {
            var n = [];
            return L(this, arguments, function(e) {
                var t = this.parentNode;
                S.inArray(this, n) < 0 && (S.cleanData(_(this)),
                t) && t.replaceChild(e, this)
            }, n)
        }
    }),
    S.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, function(e, s) {
        S.fn[e] = function(e) {
            for (var t, n = [], i = S(e), o = i.length - 1, r = 0; r <= o; r++)
                t = r === o ? this : this.clone(!0),
                S(i[r])[s](t),
                U.apply(n, t.get());
            return this.pushStack(n)
        }
    });
    var Xe, Qe, Ge, et, tt, nt, ot, H, rt = new RegExp("^(" + x + ")(?!px)[a-z%]+$","i"), st = new RegExp(j.join("|"),"i");
    function Ye(e, t, n) {
        var i, o, r = e.style;
        return (n = n || He(e)) && ("" !== (o = n.getPropertyValue(t) || n[t]) || I(e) || (o = S.style(e, t)),
        !m.pixelBoxStyles()) && rt.test(o) && st.test(t) && (e = r.width,
        t = r.minWidth,
        i = r.maxWidth,
        r.minWidth = r.maxWidth = r.width = o,
        o = n.width,
        r.width = e,
        r.minWidth = t,
        r.maxWidth = i),
        void 0 !== o ? o + "" : o
    }
    function Je(e, t) {
        return {
            get: function() {
                if (!e())
                    return (this.get = t).apply(this, arguments);
                delete this.get
            }
        }
    }
    function Ke() {
        var e;
        H && (ot.style.cssText = "position:absolute;left:-11111px;width:60px;margin-top:1px;padding:0;border:0",
        H.style.cssText = "position:relative;display:block;box-sizing:border-box;overflow:scroll;margin:auto;border:1px;padding:1px;width:60%;top:1%",
        P.appendChild(ot).appendChild(H),
        e = C.getComputedStyle(H),
        Xe = "1%" !== e.top,
        nt = 12 === Ze(e.marginLeft),
        H.style.right = "60%",
        et = 36 === Ze(e.right),
        Qe = 36 === Ze(e.width),
        H.style.position = "absolute",
        Ge = 12 === Ze(H.offsetWidth / 3),
        P.removeChild(ot),
        H = null)
    }
    function Ze(e) {
        return Math.round(parseFloat(e))
    }
    ot = E.createElement("div"),
    (H = E.createElement("div")).style && (H.style.backgroundClip = "content-box",
    H.cloneNode(!0).style.backgroundClip = "",
    m.clearCloneStyle = "content-box" === H.style.backgroundClip,
    S.extend(m, {
        boxSizingReliable: function() {
            return Ke(),
            Qe
        },
        pixelBoxStyles: function() {
            return Ke(),
            et
        },
        pixelPosition: function() {
            return Ke(),
            Xe
        },
        reliableMarginLeft: function() {
            return Ke(),
            nt
        },
        scrollboxSize: function() {
            return Ke(),
            Ge
        },
        reliableTrDimensions: function() {
            var e, t, n;
            return null == tt && (e = E.createElement("table"),
            t = E.createElement("tr"),
            n = E.createElement("div"),
            e.style.cssText = "position:absolute;left:-11111px;border-collapse:separate",
            t.style.cssText = "border:1px solid",
            t.style.height = "1px",
            n.style.height = "9px",
            n.style.display = "block",
            P.appendChild(e).appendChild(t).appendChild(n),
            n = C.getComputedStyle(t),
            tt = parseInt(n.height, 10) + parseInt(n.borderTopWidth, 10) + parseInt(n.borderBottomWidth, 10) === t.offsetHeight,
            P.removeChild(e)),
            tt
        }
    }));
    var at = ["Webkit", "Moz", "ms"]
      , dt = E.createElement("div").style
      , ht = {};
    function it(e) {
        return S.cssProps[e] || ht[e] || (e in dt ? e : ht[e] = function(e) {
            for (var t = e[0].toUpperCase() + e.slice(1), n = at.length; n--; )
                if ((e = at[n] + t)in dt)
                    return e
        }(e) || e)
    }
    var ft = /^(none|table(?!-c[ea]).+)/
      , yt = /^--/
      , bt = {
        position: "absolute",
        visibility: "hidden",
        display: "block"
    }
      , xt = {
        letterSpacing: "0",
        fontWeight: "400"
    };
    function lt(e, t, n) {
        var i = ke.exec(t);
        return i ? Math.max(0, i[2] - (n || 0)) + (i[3] || "px") : t
    }
    function ct(e, t, n, i, o, r) {
        var s = "width" === t ? 1 : 0
          , a = 0
          , l = 0;
        if (n === (i ? "border" : "content"))
            return 0;
        for (; s < 4; s += 2)
            "margin" === n && (l += S.css(e, n + j[s], !0, o)),
            i ? ("content" === n && (l -= S.css(e, "padding" + j[s], !0, o)),
            "margin" !== n && (l -= S.css(e, "border" + j[s] + "Width", !0, o))) : (l += S.css(e, "padding" + j[s], !0, o),
            "padding" !== n ? l += S.css(e, "border" + j[s] + "Width", !0, o) : a += S.css(e, "border" + j[s] + "Width", !0, o));
        return !i && 0 <= r && (l += Math.max(0, Math.ceil(e["offset" + t[0].toUpperCase() + t.slice(1)] - r - l - a - .5)) || 0),
        l
    }
    function ut(e, t, n) {
        var i = He(e)
          , o = (!m.boxSizingReliable() || n) && "border-box" === S.css(e, "boxSizing", !1, i)
          , r = o
          , s = Ye(e, t, i)
          , a = "offset" + t[0].toUpperCase() + t.slice(1);
        if (rt.test(s)) {
            if (!n)
                return s;
            s = "auto"
        }
        return (!m.boxSizingReliable() && o || !m.reliableTrDimensions() && l(e, "tr") || "auto" === s || !parseFloat(s) && "inline" === S.css(e, "display", !1, i)) && e.getClientRects().length && (o = "border-box" === S.css(e, "boxSizing", !1, i),
        r = a in e) && (s = e[a]),
        (s = parseFloat(s) || 0) + ct(e, t, n || (o ? "border" : "content"), r, i, s) + "px"
    }
    function r(e, t, n, i, o) {
        return new r.prototype.init(e,t,n,i,o)
    }
    S.extend({
        cssHooks: {
            opacity: {
                get: function(e, t) {
                    if (t)
                        return "" === (t = Ye(e, "opacity")) ? "1" : t
                }
            }
        },
        cssNumber: {
            animationIterationCount: !0,
            columnCount: !0,
            fillOpacity: !0,
            flexGrow: !0,
            flexShrink: !0,
            fontWeight: !0,
            gridArea: !0,
            gridColumn: !0,
            gridColumnEnd: !0,
            gridColumnStart: !0,
            gridRow: !0,
            gridRowEnd: !0,
            gridRowStart: !0,
            lineHeight: !0,
            opacity: !0,
            order: !0,
            orphans: !0,
            widows: !0,
            zIndex: !0,
            zoom: !0
        },
        cssProps: {},
        style: function(e, t, n, i) {
            if (e && 3 !== e.nodeType && 8 !== e.nodeType && e.style) {
                var o, r, s, a = b(t), l = yt.test(t), c = e.style;
                if (l || (t = it(a)),
                s = S.cssHooks[t] || S.cssHooks[a],
                void 0 === n)
                    return s && "get"in s && void 0 !== (o = s.get(e, !1, i)) ? o : c[t];
                "string" == (r = typeof n) && (o = ke.exec(n)) && o[1] && (n = be(e, t, o),
                r = "number"),
                null != n && n == n && ("number" !== r || l || (n += o && o[3] || (S.cssNumber[a] ? "" : "px")),
                m.clearCloneStyle || "" !== n || 0 !== t.indexOf("background") || (c[t] = "inherit"),
                s && "set"in s && void 0 === (n = s.set(e, n, i)) || (l ? c.setProperty(t, n) : c[t] = n))
            }
        },
        css: function(e, t, n, i) {
            var o, r = b(t);
            return yt.test(t) || (t = it(r)),
            "normal" === (o = void 0 === (o = (r = S.cssHooks[t] || S.cssHooks[r]) && "get"in r ? r.get(e, !0, n) : o) ? Ye(e, t, i) : o) && t in xt && (o = xt[t]),
            ("" === n || n) && (r = parseFloat(o),
            !0 === n || isFinite(r)) ? r || 0 : o
        }
    }),
    S.each(["height", "width"], function(e, s) {
        S.cssHooks[s] = {
            get: function(e, t, n) {
                if (t)
                    return !ft.test(S.css(e, "display")) || e.getClientRects().length && e.getBoundingClientRect().width ? ut(e, s, n) : $e(e, bt, function() {
                        return ut(e, s, n)
                    })
            },
            set: function(e, t, n) {
                var i = He(e)
                  , o = !m.scrollboxSize() && "absolute" === i.position
                  , r = (o || n) && "border-box" === S.css(e, "boxSizing", !1, i)
                  , n = n ? ct(e, s, n, r, i) : 0;
                return r && o && (n -= Math.ceil(e["offset" + s[0].toUpperCase() + s.slice(1)] - parseFloat(i[s]) - ct(e, s, "border", !1, i) - .5)),
                n && (r = ke.exec(t)) && "px" !== (r[3] || "px") && (e.style[s] = t,
                t = S.css(e, s)),
                lt(0, t, n)
            }
        }
    }),
    S.cssHooks.marginLeft = Je(m.reliableMarginLeft, function(e, t) {
        if (t)
            return (parseFloat(Ye(e, "marginLeft")) || e.getBoundingClientRect().left - $e(e, {
                marginLeft: 0
            }, function() {
                return e.getBoundingClientRect().left
            })) + "px"
    }),
    S.each({
        margin: "",
        padding: "",
        border: "Width"
    }, function(o, r) {
        S.cssHooks[o + r] = {
            expand: function(e) {
                for (var t = 0, n = {}, i = "string" == typeof e ? e.split(" ") : [e]; t < 4; t++)
                    n[o + j[t] + r] = i[t] || i[t - 2] || i[0];
                return n
            }
        },
        "margin" !== o && (S.cssHooks[o + r].set = lt)
    }),
    S.fn.extend({
        css: function(e, t) {
            return d(this, function(e, t, n) {
                var i, o, r = {}, s = 0;
                if (Array.isArray(t)) {
                    for (i = He(e),
                    o = t.length; s < o; s++)
                        r[t[s]] = S.css(e, t[s], !1, i);
                    return r
                }
                return void 0 !== n ? S.style(e, t, n) : S.css(e, t)
            }, e, t, 1 < arguments.length)
        }
    }),
    ((S.Tween = r).prototype = {
        constructor: r,
        init: function(e, t, n, i, o, r) {
            this.elem = e,
            this.prop = n,
            this.easing = o || S.easing._default,
            this.options = t,
            this.start = this.now = this.cur(),
            this.end = i,
            this.unit = r || (S.cssNumber[n] ? "" : "px")
        },
        cur: function() {
            var e = r.propHooks[this.prop];
            return (e && e.get ? e : r.propHooks._default).get(this)
        },
        run: function(e) {
            var t, n = r.propHooks[this.prop];
            return this.options.duration ? this.pos = t = S.easing[this.easing](e, this.options.duration * e, 0, 1, this.options.duration) : this.pos = t = e,
            this.now = (this.end - this.start) * t + this.start,
            this.options.step && this.options.step.call(this.elem, this.now, this),
            (n && n.set ? n : r.propHooks._default).set(this),
            this
        }
    }).init.prototype = r.prototype,
    (r.propHooks = {
        _default: {
            get: function(e) {
                return 1 !== e.elem.nodeType || null != e.elem[e.prop] && null == e.elem.style[e.prop] ? e.elem[e.prop] : (e = S.css(e.elem, e.prop, "")) && "auto" !== e ? e : 0
            },
            set: function(e) {
                S.fx.step[e.prop] ? S.fx.step[e.prop](e) : 1 !== e.elem.nodeType || !S.cssHooks[e.prop] && null == e.elem.style[it(e.prop)] ? e.elem[e.prop] = e.now : S.style(e.elem, e.prop, e.now + e.unit)
            }
        }
    }).scrollTop = r.propHooks.scrollLeft = {
        set: function(e) {
            e.elem.nodeType && e.elem.parentNode && (e.elem[e.prop] = e.now)
        }
    },
    S.easing = {
        linear: function(e) {
            return e
        },
        swing: function(e) {
            return .5 - Math.cos(e * Math.PI) / 2
        },
        _default: "swing"
    },
    S.fx = r.prototype.init,
    S.fx.step = {};
    var $, wt, F, St = /^(?:toggle|show|hide)$/, kt = /queueHooks$/;
    function pt() {
        wt && (!1 === E.hidden && C.requestAnimationFrame ? C.requestAnimationFrame(pt) : C.setTimeout(pt, S.fx.interval),
        S.fx.tick())
    }
    function gt() {
        return C.setTimeout(function() {
            $ = void 0
        }),
        $ = Date.now()
    }
    function mt(e, t) {
        var n, i = 0, o = {
            height: e
        };
        for (t = t ? 1 : 0; i < 4; i += 2 - t)
            o["margin" + (n = j[i])] = o["padding" + n] = e;
        return t && (o.opacity = o.width = e),
        o
    }
    function vt(e, t, n) {
        for (var i, o = (N.tweeners[t] || []).concat(N.tweeners["*"]), r = 0, s = o.length; r < s; r++)
            if (i = o[r].call(n, t, e))
                return i
    }
    function N(o, e, t) {
        var n, r, i, s, a, l, c, u = 0, d = N.prefilters.length, h = S.Deferred().always(function() {
            delete f.elem
        }), f = function() {
            if (r)
                return !1;
            for (var e = $ || gt(), e, t = 1 - ((e = Math.max(0, p.startTime + p.duration - e)) / p.duration || 0), n = 0, i = p.tweens.length; n < i; n++)
                p.tweens[n].run(t);
            return h.notifyWith(o, [p, t, e]),
            t < 1 && i ? e : (i || h.notifyWith(o, [p, 1, 0]),
            h.resolveWith(o, [p]),
            !1)
        }, p = h.promise({
            elem: o,
            props: S.extend({}, e),
            opts: S.extend(!0, {
                specialEasing: {},
                easing: S.easing._default
            }, t),
            originalProperties: e,
            originalOptions: t,
            startTime: $ || gt(),
            duration: t.duration,
            tweens: [],
            createTween: function(e, t) {
                return t = S.Tween(o, p.opts, e, t, p.opts.specialEasing[e] || p.opts.easing),
                p.tweens.push(t),
                t
            },
            stop: function(e) {
                var t = 0
                  , n = e ? p.tweens.length : 0;
                if (!r) {
                    for (r = !0; t < n; t++)
                        p.tweens[t].run(1);
                    e ? (h.notifyWith(o, [p, 1, 0]),
                    h.resolveWith(o, [p, e])) : h.rejectWith(o, [p, e])
                }
                return this
            }
        }), g = p.props, m = g, v = p.opts.specialEasing;
        for (i in m)
            if (a = v[s = b(i)],
            l = m[i],
            Array.isArray(l) && (a = l[1],
            l = m[i] = l[0]),
            i !== s && (m[s] = l,
            delete m[i]),
            (c = S.cssHooks[s]) && "expand"in c)
                for (i in l = c.expand(l),
                delete m[s],
                l)
                    i in m || (m[i] = l[i],
                    v[i] = a);
            else
                v[s] = a;
        for (; u < d; u++)
            if (n = N.prefilters[u].call(p, o, g, p.opts))
                return y(n.stop) && (S._queueHooks(p.elem, p.opts.queue).stop = n.stop.bind(n)),
                n;
        return S.map(g, vt, p),
        y(p.opts.start) && p.opts.start.call(o, p),
        p.progress(p.opts.progress).done(p.opts.done, p.opts.complete).fail(p.opts.fail).always(p.opts.always),
        S.fx.timer(S.extend(f, {
            elem: o,
            anim: p,
            queue: p.opts.queue
        })),
        p
    }
    S.Animation = S.extend(N, {
        tweeners: {
            "*": [function(e, t) {
                var n = this.createTween(e, t);
                return be(n.elem, e, ke.exec(t), n),
                n
            }
            ]
        },
        tweener: function(e, t) {
            for (var n, i = 0, o = (e = y(e) ? (t = e,
            ["*"]) : e.match(k)).length; i < o; i++)
                n = e[i],
                N.tweeners[n] = N.tweeners[n] || [],
                N.tweeners[n].unshift(t)
        },
        prefilters: [function(e, t, n) {
            var i, o, r, s, a, l, c, u = "width"in t || "height"in t, d = this, h = {}, f = e.style, p = e.nodeType && me(e), g = D.get(e, "fxshow");
            for (i in n.queue || (null == (s = S._queueHooks(e, "fx")).unqueued && (s.unqueued = 0,
            a = s.empty.fire,
            s.empty.fire = function() {
                s.unqueued || a()
            }
            ),
            s.unqueued++,
            d.always(function() {
                d.always(function() {
                    s.unqueued--,
                    S.queue(e, "fx").length || s.empty.fire()
                })
            })),
            t)
                if (o = t[i],
                St.test(o)) {
                    if (delete t[i],
                    r = r || "toggle" === o,
                    o === (p ? "hide" : "show")) {
                        if ("show" !== o || !g || void 0 === g[i])
                            continue;
                        p = !0
                    }
                    h[i] = g && g[i] || S.style(e, i)
                }
            if ((l = !S.isEmptyObject(t)) || !S.isEmptyObject(h))
                for (i in u && 1 === e.nodeType && (n.overflow = [f.overflow, f.overflowX, f.overflowY],
                null == (c = g && g.display) && (c = D.get(e, "display")),
                "none" === (u = S.css(e, "display")) && (c ? u = c : (T([e], !0),
                c = e.style.display || c,
                u = S.css(e, "display"),
                T([e]))),
                "inline" === u || "inline-block" === u && null != c) && "none" === S.css(e, "float") && (l || (d.done(function() {
                    f.display = c
                }),
                null == c && (u = f.display,
                c = "none" === u ? "" : u)),
                f.display = "inline-block"),
                n.overflow && (f.overflow = "hidden",
                d.always(function() {
                    f.overflow = n.overflow[0],
                    f.overflowX = n.overflow[1],
                    f.overflowY = n.overflow[2]
                })),
                l = !1,
                h)
                    l || (g ? "hidden"in g && (p = g.hidden) : g = D.access(e, "fxshow", {
                        display: c
                    }),
                    r && (g.hidden = !p),
                    p && T([e], !0),
                    d.done(function() {
                        for (i in p || T([e]),
                        D.remove(e, "fxshow"),
                        h)
                            S.style(e, i, h[i])
                    })),
                    l = vt(p ? g[i] : 0, i, d),
                    i in g || (g[i] = l.start,
                    p && (l.end = l.start,
                    l.start = 0))
        }
        ],
        prefilter: function(e, t) {
            t ? N.prefilters.unshift(e) : N.prefilters.push(e)
        }
    }),
    S.speed = function(e, t, n) {
        var i = e && "object" == typeof e ? S.extend({}, e) : {
            complete: n || !n && t || y(e) && e,
            duration: e,
            easing: n && t || t && !y(t) && t
        };
        return S.fx.off ? i.duration = 0 : "number" != typeof i.duration && (i.duration in S.fx.speeds ? i.duration = S.fx.speeds[i.duration] : i.duration = S.fx.speeds._default),
        null != i.queue && !0 !== i.queue || (i.queue = "fx"),
        i.old = i.complete,
        i.complete = function() {
            y(i.old) && i.old.call(this),
            i.queue && S.dequeue(this, i.queue)
        }
        ,
        i
    }
    ,
    S.fn.extend({
        fadeTo: function(e, t, n, i) {
            return this.filter(me).css("opacity", 0).show().end().animate({
                opacity: t
            }, e, n, i)
        },
        animate: function(t, e, n, i) {
            function o() {
                var e = N(this, S.extend({}, t), s);
                (r || D.get(this, "finish")) && e.stop(!0)
            }
            var r = S.isEmptyObject(t)
              , s = S.speed(e, n, i);
            return o.finish = o,
            r || !1 === s.queue ? this.each(o) : this.queue(s.queue, o)
        },
        stop: function(o, e, r) {
            function s(e) {
                var t = e.stop;
                delete e.stop,
                t(r)
            }
            return "string" != typeof o && (r = e,
            e = o,
            o = void 0),
            e && this.queue(o || "fx", []),
            this.each(function() {
                var e = !0
                  , t = null != o && o + "queueHooks"
                  , n = S.timers
                  , i = D.get(this);
                if (t)
                    i[t] && i[t].stop && s(i[t]);
                else
                    for (t in i)
                        i[t] && i[t].stop && kt.test(t) && s(i[t]);
                for (t = n.length; t--; )
                    n[t].elem !== this || null != o && n[t].queue !== o || (n[t].anim.stop(r),
                    e = !1,
                    n.splice(t, 1));
                !e && r || S.dequeue(this, o)
            })
        },
        finish: function(s) {
            return !1 !== s && (s = s || "fx"),
            this.each(function() {
                var e, t = D.get(this), n = t[s + "queue"], i = t[s + "queueHooks"], o = S.timers, r = n ? n.length : 0;
                for (t.finish = !0,
                S.queue(this, s, []),
                i && i.stop && i.stop.call(this, !0),
                e = o.length; e--; )
                    o[e].elem === this && o[e].queue === s && (o[e].anim.stop(!0),
                    o.splice(e, 1));
                for (e = 0; e < r; e++)
                    n[e] && n[e].finish && n[e].finish.call(this);
                delete t.finish
            })
        }
    }),
    S.each(["toggle", "show", "hide"], function(e, i) {
        var o = S.fn[i];
        S.fn[i] = function(e, t, n) {
            return null == e || "boolean" == typeof e ? o.apply(this, arguments) : this.animate(mt(i, !0), e, t, n)
        }
    }),
    S.each({
        slideDown: mt("show"),
        slideUp: mt("hide"),
        slideToggle: mt("toggle"),
        fadeIn: {
            opacity: "show"
        },
        fadeOut: {
            opacity: "hide"
        },
        fadeToggle: {
            opacity: "toggle"
        }
    }, function(e, i) {
        S.fn[e] = function(e, t, n) {
            return this.animate(i, e, t, n)
        }
    }),
    S.timers = [],
    S.fx.tick = function() {
        var e, t = 0, n = S.timers;
        for ($ = Date.now(); t < n.length; t++)
            (e = n[t])() || n[t] !== e || n.splice(t--, 1);
        n.length || S.fx.stop(),
        $ = void 0
    }
    ,
    S.fx.timer = function(e) {
        S.timers.push(e),
        S.fx.start()
    }
    ,
    S.fx.interval = 13,
    S.fx.start = function() {
        wt || (wt = !0,
        pt())
    }
    ,
    S.fx.stop = function() {
        wt = null
    }
    ,
    S.fx.speeds = {
        slow: 600,
        fast: 200,
        _default: 400
    },
    S.fn.delay = function(i, e) {
        return i = S.fx && S.fx.speeds[i] || i,
        this.queue(e = e || "fx", function(e, t) {
            var n = C.setTimeout(e, i);
            t.stop = function() {
                C.clearTimeout(n)
            }
        })
    }
    ,
    F = E.createElement("input"),
    M = E.createElement("select").appendChild(E.createElement("option")),
    F.type = "checkbox",
    m.checkOn = "" !== F.value,
    m.optSelected = M.selected,
    (F = E.createElement("input")).value = "t",
    F.type = "radio",
    m.radioValue = "t" === F.value;
    var Dt, Tt = S.expr.attrHandle, _t = (S.fn.extend({
        attr: function(e, t) {
            return d(this, S.attr, e, t, 1 < arguments.length)
        },
        removeAttr: function(e) {
            return this.each(function() {
                S.removeAttr(this, e)
            })
        }
    }),
    S.extend({
        attr: function(e, t, n) {
            var i, o, r = e.nodeType;
            if (3 !== r && 8 !== r && 2 !== r)
                return void 0 === e.getAttribute ? S.prop(e, t, n) : (1 === r && S.isXMLDoc(e) || (o = S.attrHooks[t.toLowerCase()] || (S.expr.match.bool.test(t) ? Dt : void 0)),
                void 0 !== n ? null === n ? void S.removeAttr(e, t) : o && "set"in o && void 0 !== (i = o.set(e, n, t)) ? i : (e.setAttribute(t, n + ""),
                n) : o && "get"in o && null !== (i = o.get(e, t)) || null != (i = S.find.attr(e, t)) ? i : void 0)
        },
        attrHooks: {
            type: {
                set: function(e, t) {
                    var n;
                    if (!m.radioValue && "radio" === t && l(e, "input"))
                        return n = e.value,
                        e.setAttribute("type", t),
                        n && (e.value = n),
                        t
                }
            }
        },
        removeAttr: function(e, t) {
            var n, i = 0, o = t && t.match(k);
            if (o && 1 === e.nodeType)
                for (; n = o[i++]; )
                    e.removeAttribute(n)
        }
    }),
    Dt = {
        set: function(e, t, n) {
            return !1 === t ? S.removeAttr(e, n) : e.setAttribute(n, n),
            n
        }
    },
    S.each(S.expr.match.bool.source.match(/\w+/g), function(e, t) {
        var s = Tt[t] || S.find.attr;
        Tt[t] = function(e, t, n) {
            var i, o, r = t.toLowerCase();
            return n || (o = Tt[r],
            Tt[r] = i,
            i = null != s(e, t, n) ? r : null,
            Tt[r] = o),
            i
        }
    }),
    /^(?:input|select|textarea|button)$/i), At = /^(?:a|area)$/i;
    function q(e) {
        return (e.match(k) || []).join(" ")
    }
    function z(e) {
        return e.getAttribute && e.getAttribute("class") || ""
    }
    function Ct(e) {
        return Array.isArray(e) ? e : "string" == typeof e && e.match(k) || []
    }
    function Et(e) {
        e.stopPropagation()
    }
    S.fn.extend({
        prop: function(e, t) {
            return d(this, S.prop, e, t, 1 < arguments.length)
        },
        removeProp: function(e) {
            return this.each(function() {
                delete this[S.propFix[e] || e]
            })
        }
    }),
    S.extend({
        prop: function(e, t, n) {
            var i, o, r = e.nodeType;
            if (3 !== r && 8 !== r && 2 !== r)
                return 1 === r && S.isXMLDoc(e) || (t = S.propFix[t] || t,
                o = S.propHooks[t]),
                void 0 !== n ? o && "set"in o && void 0 !== (i = o.set(e, n, t)) ? i : e[t] = n : o && "get"in o && null !== (i = o.get(e, t)) ? i : e[t]
        },
        propHooks: {
            tabIndex: {
                get: function(e) {
                    var t = S.find.attr(e, "tabindex");
                    return t ? parseInt(t, 10) : _t.test(e.nodeName) || At.test(e.nodeName) && e.href ? 0 : -1
                }
            }
        },
        propFix: {
            for: "htmlFor",
            class: "className"
        }
    }),
    m.optSelected || (S.propHooks.selected = {
        get: function(e) {
            return (e = e.parentNode) && e.parentNode && e.parentNode.selectedIndex,
            null
        },
        set: function(e) {
            (e = e.parentNode) && (e.selectedIndex,
            e.parentNode) && e.parentNode.selectedIndex
        }
    }),
    S.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function() {
        S.propFix[this.toLowerCase()] = this
    }),
    S.fn.extend({
        addClass: function(t) {
            var e, n, i, o, r, s, a = 0;
            if (y(t))
                return this.each(function(e) {
                    S(this).addClass(t.call(this, e, z(this)))
                });
            if ((e = Ct(t)).length)
                for (; n = this[a++]; )
                    if (s = z(n),
                    i = 1 === n.nodeType && " " + q(s) + " ") {
                        for (r = 0; o = e[r++]; )
                            i.indexOf(" " + o + " ") < 0 && (i += o + " ");
                        s !== (s = q(i)) && n.setAttribute("class", s)
                    }
            return this
        },
        removeClass: function(t) {
            var e, n, i, o, r, s, a = 0;
            if (y(t))
                return this.each(function(e) {
                    S(this).removeClass(t.call(this, e, z(this)))
                });
            if (!arguments.length)
                return this.attr("class", "");
            if ((e = Ct(t)).length)
                for (; n = this[a++]; )
                    if (s = z(n),
                    i = 1 === n.nodeType && " " + q(s) + " ") {
                        for (r = 0; o = e[r++]; )
                            for (; -1 < i.indexOf(" " + o + " "); )
                                i = i.replace(" " + o + " ", " ");
                        s !== (s = q(i)) && n.setAttribute("class", s)
                    }
            return this
        },
        toggleClass: function(o, t) {
            var r = typeof o
              , s = "string" == r || Array.isArray(o);
            return "boolean" == typeof t && s ? t ? this.addClass(o) : this.removeClass(o) : y(o) ? this.each(function(e) {
                S(this).toggleClass(o.call(this, e, z(this), t), t)
            }) : this.each(function() {
                var e, t, n, i;
                if (s)
                    for (t = 0,
                    n = S(this),
                    i = Ct(o); e = i[t++]; )
                        n.hasClass(e) ? n.removeClass(e) : n.addClass(e);
                else
                    void 0 !== o && "boolean" != r || ((e = z(this)) && D.set(this, "__className__", e),
                    this.setAttribute && this.setAttribute("class", !e && !1 !== o && D.get(this, "__className__") || ""))
            })
        },
        hasClass: function(e) {
            for (var t, n = 0, i = " " + e + " "; t = this[n++]; )
                if (1 === t.nodeType && -1 < (" " + q(z(t)) + " ").indexOf(i))
                    return !0;
            return !1
        }
    });
    var Lt = /\r/g
      , Nt = (S.fn.extend({
        val: function(t) {
            var n, e, i, o = this[0];
            return arguments.length ? (i = y(t),
            this.each(function(e) {
                1 === this.nodeType && (null == (e = i ? t.call(this, e, S(this).val()) : t) ? e = "" : "number" == typeof e ? e += "" : Array.isArray(e) && (e = S.map(e, function(e) {
                    return null == e ? "" : e + ""
                })),
                (n = S.valHooks[this.type] || S.valHooks[this.nodeName.toLowerCase()]) && "set"in n && void 0 !== n.set(this, e, "value") || (this.value = e))
            })) : o ? (n = S.valHooks[o.type] || S.valHooks[o.nodeName.toLowerCase()]) && "get"in n && void 0 !== (e = n.get(o, "value")) ? e : "string" == typeof (e = o.value) ? e.replace(Lt, "") : null == e ? "" : e : void 0
        }
    }),
    S.extend({
        valHooks: {
            option: {
                get: function(e) {
                    var t = S.find.attr(e, "value");
                    return null != t ? t : q(S.text(e))
                }
            },
            select: {
                get: function(e) {
                    for (var t, n = e.options, i = e.selectedIndex, o = "select-one" === e.type, r = o ? null : [], s = o ? i + 1 : n.length, a = i < 0 ? s : o ? i : 0; a < s; a++)
                        if (((t = n[a]).selected || a === i) && !t.disabled && (!t.parentNode.disabled || !l(t.parentNode, "optgroup"))) {
                            if (t = S(t).val(),
                            o)
                                return t;
                            r.push(t)
                        }
                    return r
                },
                set: function(e, t) {
                    for (var n, i, o = e.options, r = S.makeArray(t), s = o.length; s--; )
                        ((i = o[s]).selected = -1 < S.inArray(S.valHooks.option.get(i), r)) && (n = !0);
                    return n || (e.selectedIndex = -1),
                    r
                }
            }
        }
    }),
    S.each(["radio", "checkbox"], function() {
        S.valHooks[this] = {
            set: function(e, t) {
                if (Array.isArray(t))
                    return e.checked = -1 < S.inArray(S(e).val(), t)
            }
        },
        m.checkOn || (S.valHooks[this].get = function(e) {
            return null === e.getAttribute("value") ? "on" : e.value
        }
        )
    }),
    m.focusin = "onfocusin"in C,
    /^(?:focusinfocus|focusoutblur)$/)
      , jt = (S.extend(S.event, {
        trigger: function(e, t, n, i) {
            var o, r, s, a, l, c, u, d = [n || E], h = Z.call(e, "type") ? e.type : e, f = Z.call(e, "namespace") ? e.namespace.split(".") : [], p = u = r = n = n || E;
            if (3 !== n.nodeType && 8 !== n.nodeType && !Nt.test(h + S.event.triggered) && (-1 < h.indexOf(".") && (h = (f = h.split(".")).shift(),
            f.sort()),
            a = h.indexOf(":") < 0 && "on" + h,
            (e = e[S.expando] ? e : new S.Event(h,"object" == typeof e && e)).isTrigger = i ? 2 : 3,
            e.namespace = f.join("."),
            e.rnamespace = e.namespace ? new RegExp("(^|\\.)" + f.join("\\.(?:.*\\.|)") + "(\\.|$)") : null,
            e.result = void 0,
            e.target || (e.target = n),
            t = null == t ? [e] : S.makeArray(t, [e]),
            c = S.event.special[h] || {},
            i || !c.trigger || !1 !== c.trigger.apply(n, t))) {
                if (!i && !c.noBubble && !g(n)) {
                    for (s = c.delegateType || h,
                    Nt.test(s + h) || (p = p.parentNode); p; p = p.parentNode)
                        d.push(p),
                        r = p;
                    r === (n.ownerDocument || E) && d.push(r.defaultView || r.parentWindow || C)
                }
                for (o = 0; (p = d[o++]) && !e.isPropagationStopped(); )
                    u = p,
                    e.type = 1 < o ? s : c.bindType || h,
                    (l = (D.get(p, "events") || Object.create(null))[e.type] && D.get(p, "handle")) && l.apply(p, t),
                    (l = a && p[a]) && l.apply && v(p) && (e.result = l.apply(p, t),
                    !1 === e.result) && e.preventDefault();
                return e.type = h,
                i || e.isDefaultPrevented() || c._default && !1 !== c._default.apply(d.pop(), t) || !v(n) || a && y(n[h]) && !g(n) && ((r = n[a]) && (n[a] = null),
                S.event.triggered = h,
                e.isPropagationStopped() && u.addEventListener(h, Et),
                n[h](),
                e.isPropagationStopped() && u.removeEventListener(h, Et),
                S.event.triggered = void 0,
                r) && (n[a] = r),
                e.result
            }
        },
        simulate: function(e, t, n) {
            n = S.extend(new S.Event, n, {
                type: e,
                isSimulated: !0
            }),
            S.event.trigger(n, null, t)
        }
    }),
    S.fn.extend({
        trigger: function(e, t) {
            return this.each(function() {
                S.event.trigger(e, t, this)
            })
        },
        triggerHandler: function(e, t) {
            var n = this[0];
            if (n)
                return S.event.trigger(e, t, n, !0)
        }
    }),
    m.focusin || S.each({
        focus: "focusin",
        blur: "focusout"
    }, function(n, i) {
        function o(e) {
            S.event.simulate(i, e.target, S.event.fix(e))
        }
        S.event.special[i] = {
            setup: function() {
                var e = this.ownerDocument || this.document || this
                  , t = D.access(e, i);
                t || e.addEventListener(n, o, !0),
                D.access(e, i, (t || 0) + 1)
            },
            teardown: function() {
                var e = this.ownerDocument || this.document || this
                  , t = D.access(e, i) - 1;
                t ? D.access(e, i, t) : (e.removeEventListener(n, o, !0),
                D.remove(e, i))
            }
        }
    }),
    C.location)
      , Pt = {
        guid: Date.now()
    }
      , qt = /\?/
      , zt = (S.parseXML = function(e) {
        var t, n;
        if (!e || "string" != typeof e)
            return null;
        try {
            t = (new C.DOMParser).parseFromString(e, "text/xml")
        } catch (e) {}
        return n = t && t.getElementsByTagName("parsererror")[0],
        t && !n || S.error("Invalid XML: " + (n ? S.map(n.childNodes, function(e) {
            return e.textContent
        }).join("\n") : e)),
        t
    }
    ,
    /\[\]$/)
      , It = /\r?\n/g
      , Mt = /^(?:submit|button|image|reset|file)$/i
      , Ot = /^(?:input|select|textarea|keygen)/i
      , Ht = (S.param = function(e, t) {
        function n(e, t) {
            t = y(t) ? t() : t,
            o[o.length] = encodeURIComponent(e) + "=" + encodeURIComponent(null == t ? "" : t)
        }
        var i, o = [];
        if (null == e)
            return "";
        if (Array.isArray(e) || e.jquery && !S.isPlainObject(e))
            S.each(e, function() {
                n(this.name, this.value)
            });
        else
            for (i in e)
                !function n(i, e, o, r) {
                    if (Array.isArray(e))
                        S.each(e, function(e, t) {
                            o || zt.test(i) ? r(i, t) : n(i + "[" + ("object" == typeof t && null != t ? e : "") + "]", t, o, r)
                        });
                    else if (o || "object" !== p(e))
                        r(i, e);
                    else
                        for (var t in e)
                            n(i + "[" + t + "]", e[t], o, r)
                }(i, e[i], t, n);
        return o.join("&")
    }
    ,
    S.fn.extend({
        serialize: function() {
            return S.param(this.serializeArray())
        },
        serializeArray: function() {
            return this.map(function() {
                var e = S.prop(this, "elements");
                return e ? S.makeArray(e) : this
            }).filter(function() {
                var e = this.type;
                return this.name && !S(this).is(":disabled") && Ot.test(this.nodeName) && !Mt.test(e) && (this.checked || !je.test(e))
            }).map(function(e, t) {
                var n = S(this).val();
                return null == n ? null : Array.isArray(n) ? S.map(n, function(e) {
                    return {
                        name: t.name,
                        value: e.replace(It, "\r\n")
                    }
                }) : {
                    name: t.name,
                    value: n.replace(It, "\r\n")
                }
            }).get()
        }
    }),
    /%20/g)
      , $t = /#.*$/
      , Ft = /([?&])_=[^&]*/
      , Wt = /^(.*?):[ \t]*([^\r\n]*)$/gm
      , Vt = /^(?:GET|HEAD)$/
      , Xt = /^\/\//
      , Qt = {}
      , Gt = {}
      , Yt = "*/".concat("*")
      , Jt = E.createElement("a");
    function Bt(r) {
        return function(e, t) {
            "string" != typeof e && (t = e,
            e = "*");
            var n, i = 0, o = e.toLowerCase().match(k) || [];
            if (y(t))
                for (; n = o[i++]; )
                    "+" === n[0] ? (n = n.slice(1) || "*",
                    (r[n] = r[n] || []).unshift(t)) : (r[n] = r[n] || []).push(t)
        }
    }
    function Rt(t, i, o, r) {
        var s = {}
          , a = t === Gt;
        function l(e) {
            var n;
            return s[e] = !0,
            S.each(t[e] || [], function(e, t) {
                return "string" != typeof (t = t(i, o, r)) || a || s[t] ? a ? !(n = t) : void 0 : (i.dataTypes.unshift(t),
                l(t),
                !1)
            }),
            n
        }
        return l(i.dataTypes[0]) || !s["*"] && l("*")
    }
    function Ut(e, t) {
        var n, i, o = S.ajaxSettings.flatOptions || {};
        for (n in t)
            void 0 !== t[n] && ((o[n] ? e : i = i || {})[n] = t[n]);
        return i && S.extend(!0, e, i),
        e
    }
    Jt.href = jt.href,
    S.extend({
        active: 0,
        lastModified: {},
        etag: {},
        ajaxSettings: {
            url: jt.href,
            type: "GET",
            isLocal: /^(?:about|app|app-storage|.+-extension|file|res|widget):$/.test(jt.protocol),
            global: !0,
            processData: !0,
            async: !0,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            accepts: {
                "*": Yt,
                text: "text/plain",
                html: "text/html",
                xml: "application/xml, text/xml",
                json: "application/json, text/javascript"
            },
            contents: {
                xml: /\bxml\b/,
                html: /\bhtml/,
                json: /\bjson\b/
            },
            responseFields: {
                xml: "responseXML",
                text: "responseText",
                json: "responseJSON"
            },
            converters: {
                "* text": String,
                "text html": !0,
                "text json": JSON.parse,
                "text xml": S.parseXML
            },
            flatOptions: {
                url: !0,
                context: !0
            }
        },
        ajaxSetup: function(e, t) {
            return t ? Ut(Ut(e, S.ajaxSettings), t) : Ut(S.ajaxSettings, e)
        },
        ajaxPrefilter: Bt(Qt),
        ajaxTransport: Bt(Gt),
        ajax: function(e, t) {
            "object" == typeof e && (t = e,
            e = void 0);
            var l, c, u, n, d, h, f, i, o, p = S.ajaxSetup({}, t = t || {}), g = p.context || p, m = p.context && (g.nodeType || g.jquery) ? S(g) : S.event, v = S.Deferred(), y = S.Callbacks("once memory"), b = p.statusCode || {}, r = {}, s = {}, a = "canceled", x = {
                readyState: 0,
                getResponseHeader: function(e) {
                    var t;
                    if (h) {
                        if (!n)
                            for (n = {}; t = Wt.exec(u); )
                                n[t[1].toLowerCase() + " "] = (n[t[1].toLowerCase() + " "] || []).concat(t[2]);
                        t = n[e.toLowerCase() + " "]
                    }
                    return null == t ? null : t.join(", ")
                },
                getAllResponseHeaders: function() {
                    return h ? u : null
                },
                setRequestHeader: function(e, t) {
                    return null == h && (e = s[e.toLowerCase()] = s[e.toLowerCase()] || e,
                    r[e] = t),
                    this
                },
                overrideMimeType: function(e) {
                    return null == h && (p.mimeType = e),
                    this
                },
                statusCode: function(e) {
                    if (e)
                        if (h)
                            x.always(e[x.status]);
                        else
                            for (var t in e)
                                b[t] = [b[t], e[t]];
                    return this
                },
                abort: function(e) {
                    return e = e || a,
                    l && l.abort(e),
                    w(0, e),
                    this
                }
            };
            if (v.promise(x),
            p.url = ((e || p.url || jt.href) + "").replace(Xt, jt.protocol + "//"),
            p.type = t.method || t.type || p.method || p.type,
            p.dataTypes = (p.dataType || "*").toLowerCase().match(k) || [""],
            null == p.crossDomain) {
                o = E.createElement("a");
                try {
                    o.href = p.url,
                    o.href = o.href,
                    p.crossDomain = Jt.protocol + "//" + Jt.host != o.protocol + "//" + o.host
                } catch (e) {
                    p.crossDomain = !0
                }
            }
            if (p.data && p.processData && "string" != typeof p.data && (p.data = S.param(p.data, p.traditional)),
            Rt(Qt, p, t, x),
            !h) {
                for (i in (f = S.event && p.global) && 0 == S.active++ && S.event.trigger("ajaxStart"),
                p.type = p.type.toUpperCase(),
                p.hasContent = !Vt.test(p.type),
                c = p.url.replace($t, ""),
                p.hasContent ? p.data && p.processData && 0 === (p.contentType || "").indexOf("application/x-www-form-urlencoded") && (p.data = p.data.replace(Ht, "+")) : (o = p.url.slice(c.length),
                p.data && (p.processData || "string" == typeof p.data) && (c += (qt.test(c) ? "&" : "?") + p.data,
                delete p.data),
                !1 === p.cache && (c = c.replace(Ft, "$1"),
                o = (qt.test(c) ? "&" : "?") + "_=" + Pt.guid++ + o),
                p.url = c + o),
                p.ifModified && (S.lastModified[c] && x.setRequestHeader("If-Modified-Since", S.lastModified[c]),
                S.etag[c]) && x.setRequestHeader("If-None-Match", S.etag[c]),
                (p.data && p.hasContent && !1 !== p.contentType || t.contentType) && x.setRequestHeader("Content-Type", p.contentType),
                x.setRequestHeader("Accept", p.dataTypes[0] && p.accepts[p.dataTypes[0]] ? p.accepts[p.dataTypes[0]] + ("*" !== p.dataTypes[0] ? ", " + Yt + "; q=0.01" : "") : p.accepts["*"]),
                p.headers)
                    x.setRequestHeader(i, p.headers[i]);
                if (p.beforeSend && (!1 === p.beforeSend.call(g, x, p) || h))
                    return x.abort();
                if (a = "abort",
                y.add(p.complete),
                x.done(p.success),
                x.fail(p.error),
                l = Rt(Gt, p, t, x)) {
                    if (x.readyState = 1,
                    f && m.trigger("ajaxSend", [x, p]),
                    h)
                        return x;
                    p.async && 0 < p.timeout && (d = C.setTimeout(function() {
                        x.abort("timeout")
                    }, p.timeout));
                    try {
                        h = !1,
                        l.send(r, w)
                    } catch (e) {
                        if (h)
                            throw e;
                        w(-1, e)
                    }
                } else
                    w(-1, "No Transport")
            }
            return x;
            function w(e, t, n, i) {
                var o, r, s, a = t;
                h || (h = !0,
                d && C.clearTimeout(d),
                l = void 0,
                u = i || "",
                x.readyState = 0 < e ? 4 : 0,
                i = 200 <= e && e < 300 || 304 === e,
                n && (s = function(e, t, n) {
                    for (var i, o, r, s, a = e.contents, l = e.dataTypes; "*" === l[0]; )
                        l.shift(),
                        void 0 === i && (i = e.mimeType || t.getResponseHeader("Content-Type"));
                    if (i)
                        for (o in a)
                            if (a[o] && a[o].test(i)) {
                                l.unshift(o);
                                break
                            }
                    if (l[0]in n)
                        r = l[0];
                    else {
                        for (o in n) {
                            if (!l[0] || e.converters[o + " " + l[0]]) {
                                r = o;
                                break
                            }
                            s = s || o
                        }
                        r = r || s
                    }
                    if (r)
                        return r !== l[0] && l.unshift(r),
                        n[r]
                }(p, x, n)),
                !i && -1 < S.inArray("script", p.dataTypes) && S.inArray("json", p.dataTypes) < 0 && (p.converters["text script"] = function() {}
                ),
                s = function(e, t, n, i) {
                    var o, r, s, a, l, c = {}, u = e.dataTypes.slice();
                    if (u[1])
                        for (s in e.converters)
                            c[s.toLowerCase()] = e.converters[s];
                    for (r = u.shift(); r; )
                        if (e.responseFields[r] && (n[e.responseFields[r]] = t),
                        !l && i && e.dataFilter && (t = e.dataFilter(t, e.dataType)),
                        l = r,
                        r = u.shift())
                            if ("*" === r)
                                r = l;
                            else if ("*" !== l && l !== r) {
                                if (!(s = c[l + " " + r] || c["* " + r]))
                                    for (o in c)
                                        if ((a = o.split(" "))[1] === r && (s = c[l + " " + a[0]] || c["* " + a[0]])) {
                                            !0 === s ? s = c[o] : !0 !== c[o] && (r = a[0],
                                            u.unshift(a[1]));
                                            break
                                        }
                                if (!0 !== s)
                                    if (s && e.throws)
                                        t = s(t);
                                    else
                                        try {
                                            t = s(t)
                                        } catch (e) {
                                            return {
                                                state: "parsererror",
                                                error: s ? e : "No conversion from " + l + " to " + r
                                            }
                                        }
                            }
                    return {
                        state: "success",
                        data: t
                    }
                }(p, s, x, i),
                i ? (p.ifModified && ((n = x.getResponseHeader("Last-Modified")) && (S.lastModified[c] = n),
                n = x.getResponseHeader("etag")) && (S.etag[c] = n),
                204 === e || "HEAD" === p.type ? a = "nocontent" : 304 === e ? a = "notmodified" : (a = s.state,
                o = s.data,
                i = !(r = s.error))) : (r = a,
                !e && a || (a = "error",
                e < 0 && (e = 0))),
                x.status = e,
                x.statusText = (t || a) + "",
                i ? v.resolveWith(g, [o, a, x]) : v.rejectWith(g, [x, a, r]),
                x.statusCode(b),
                b = void 0,
                f && m.trigger(i ? "ajaxSuccess" : "ajaxError", [x, p, i ? o : r]),
                y.fireWith(g, [x, a]),
                f && (m.trigger("ajaxComplete", [x, p]),
                --S.active || S.event.trigger("ajaxStop")))
            }
        },
        getJSON: function(e, t, n) {
            return S.get(e, t, n, "json")
        },
        getScript: function(e, t) {
            return S.get(e, void 0, t, "script")
        }
    }),
    S.each(["get", "post"], function(e, o) {
        S[o] = function(e, t, n, i) {
            return y(t) && (i = i || n,
            n = t,
            t = void 0),
            S.ajax(S.extend({
                url: e,
                type: o,
                dataType: i,
                data: t,
                success: n
            }, S.isPlainObject(e) && e))
        }
    }),
    S.ajaxPrefilter(function(e) {
        for (var t in e.headers)
            "content-type" === t.toLowerCase() && (e.contentType = e.headers[t] || "")
    }),
    S._evalUrl = function(e, t, n) {
        return S.ajax({
            url: e,
            type: "GET",
            dataType: "script",
            cache: !0,
            async: !1,
            global: !1,
            converters: {
                "text script": function() {}
            },
            dataFilter: function(e) {
                S.globalEval(e, t, n)
            }
        })
    }
    ,
    S.fn.extend({
        wrapAll: function(e) {
            return this[0] && (y(e) && (e = e.call(this[0])),
            e = S(e, this[0].ownerDocument).eq(0).clone(!0),
            this[0].parentNode && e.insertBefore(this[0]),
            e.map(function() {
                for (var e = this; e.firstElementChild; )
                    e = e.firstElementChild;
                return e
            }).append(this)),
            this
        },
        wrapInner: function(n) {
            return y(n) ? this.each(function(e) {
                S(this).wrapInner(n.call(this, e))
            }) : this.each(function() {
                var e = S(this)
                  , t = e.contents();
                t.length ? t.wrapAll(n) : e.append(n)
            })
        },
        wrap: function(t) {
            var n = y(t);
            return this.each(function(e) {
                S(this).wrapAll(n ? t.call(this, e) : t)
            })
        },
        unwrap: function(e) {
            return this.parent(e).not("body").each(function() {
                S(this).replaceWith(this.childNodes)
            }),
            this
        }
    }),
    S.expr.pseudos.hidden = function(e) {
        return !S.expr.pseudos.visible(e)
    }
    ,
    S.expr.pseudos.visible = function(e) {
        return !!(e.offsetWidth || e.offsetHeight || e.getClientRects().length)
    }
    ,
    S.ajaxSettings.xhr = function() {
        try {
            return new C.XMLHttpRequest
        } catch (e) {}
    }
    ;
    var Kt = {
        0: 200,
        1223: 204
    }
      , Zt = S.ajaxSettings.xhr()
      , en = (m.cors = !!Zt && "withCredentials"in Zt,
    m.ajax = Zt = !!Zt,
    S.ajaxTransport(function(o) {
        var r, s;
        if (m.cors || Zt && !o.crossDomain)
            return {
                send: function(e, t) {
                    var n, i = o.xhr();
                    if (i.open(o.type, o.url, o.async, o.username, o.password),
                    o.xhrFields)
                        for (n in o.xhrFields)
                            i[n] = o.xhrFields[n];
                    for (n in o.mimeType && i.overrideMimeType && i.overrideMimeType(o.mimeType),
                    o.crossDomain || e["X-Requested-With"] || (e["X-Requested-With"] = "XMLHttpRequest"),
                    e)
                        i.setRequestHeader(n, e[n]);
                    r = function(e) {
                        return function() {
                            r && (r = s = i.onload = i.onerror = i.onabort = i.ontimeout = i.onreadystatechange = null,
                            "abort" === e ? i.abort() : "error" === e ? "number" != typeof i.status ? t(0, "error") : t(i.status, i.statusText) : t(Kt[i.status] || i.status, i.statusText, "text" !== (i.responseType || "text") || "string" != typeof i.responseText ? {
                                binary: i.response
                            } : {
                                text: i.responseText
                            }, i.getAllResponseHeaders()))
                        }
                    }
                    ,
                    i.onload = r(),
                    s = i.onerror = i.ontimeout = r("error"),
                    void 0 !== i.onabort ? i.onabort = s : i.onreadystatechange = function() {
                        4 === i.readyState && C.setTimeout(function() {
                            r && s()
                        })
                    }
                    ,
                    r = r("abort");
                    try {
                        i.send(o.hasContent && o.data || null)
                    } catch (e) {
                        if (r)
                            throw e
                    }
                },
                abort: function() {
                    r && r()
                }
            }
    }),
    S.ajaxPrefilter(function(e) {
        e.crossDomain && (e.contents.script = !1)
    }),
    S.ajaxSetup({
        accepts: {
            script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
        },
        contents: {
            script: /\b(?:java|ecma)script\b/
        },
        converters: {
            "text script": function(e) {
                return S.globalEval(e),
                e
            }
        }
    }),
    S.ajaxPrefilter("script", function(e) {
        void 0 === e.cache && (e.cache = !1),
        e.crossDomain && (e.type = "GET")
    }),
    S.ajaxTransport("script", function(n) {
        var i, o;
        if (n.crossDomain || n.scriptAttrs)
            return {
                send: function(e, t) {
                    i = S("<script>").attr(n.scriptAttrs || {}).prop({
                        charset: n.scriptCharset,
                        src: n.url
                    }).on("load error", o = function(e) {
                        i.remove(),
                        o = null,
                        e && t("error" === e.type ? 404 : 200, e.type)
                    }
                    ),
                    E.head.appendChild(i[0])
                },
                abort: function() {
                    o && o()
                }
            }
    }),
    [])
      , tn = /(=)\?(?=&|$)|\?\?/
      , nn = (S.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function() {
            var e = en.pop() || S.expando + "_" + Pt.guid++;
            return this[e] = !0,
            e
        }
    }),
    S.ajaxPrefilter("json jsonp", function(e, t, n) {
        var i, o, r, s = !1 !== e.jsonp && (tn.test(e.url) ? "url" : "string" == typeof e.data && 0 === (e.contentType || "").indexOf("application/x-www-form-urlencoded") && tn.test(e.data) && "data");
        if (s || "jsonp" === e.dataTypes[0])
            return i = e.jsonpCallback = y(e.jsonpCallback) ? e.jsonpCallback() : e.jsonpCallback,
            s ? e[s] = e[s].replace(tn, "$1" + i) : !1 !== e.jsonp && (e.url += (qt.test(e.url) ? "&" : "?") + e.jsonp + "=" + i),
            e.converters["script json"] = function() {
                return r || S.error(i + " was not called"),
                r[0]
            }
            ,
            e.dataTypes[0] = "json",
            o = C[i],
            C[i] = function() {
                r = arguments
            }
            ,
            n.always(function() {
                void 0 === o ? S(C).removeProp(i) : C[i] = o,
                e[i] && (e.jsonpCallback = t.jsonpCallback,
                en.push(i)),
                r && y(o) && o(r[0]),
                r = o = void 0
            }),
            "script"
    }),
    m.createHTMLDocument = ((x = E.implementation.createHTMLDocument("").body).innerHTML = "<form></form><form></form>",
    2 === x.childNodes.length),
    S.parseHTML = function(e, t, n) {
        return "string" != typeof e ? [] : ("boolean" == typeof t && (n = t,
        t = !1),
        t || (m.createHTMLDocument ? ((i = (t = E.implementation.createHTMLDocument("")).createElement("base")).href = E.location.href,
        t.head.appendChild(i)) : t = E),
        i = !n && [],
        (n = ae.exec(e)) ? [t.createElement(n[1])] : (n = De([e], t, i),
        i && i.length && S(i).remove(),
        S.merge([], n.childNodes)));
        var i
    }
    ,
    S.fn.load = function(e, t, n) {
        var i, o, r, s = this, a = e.indexOf(" ");
        return -1 < a && (i = q(e.slice(a)),
        e = e.slice(0, a)),
        y(t) ? (n = t,
        t = void 0) : t && "object" == typeof t && (o = "POST"),
        0 < s.length && S.ajax({
            url: e,
            type: o || "GET",
            dataType: "html",
            data: t
        }).done(function(e) {
            r = arguments,
            s.html(i ? S("<div>").append(S.parseHTML(e)).find(i) : e)
        }).always(n && function(e, t) {
            s.each(function() {
                n.apply(this, r || [e.responseText, t, e])
            })
        }
        ),
        this
    }
    ,
    S.expr.pseudos.animated = function(t) {
        return S.grep(S.timers, function(e) {
            return t === e.elem
        }).length
    }
    ,
    S.offset = {
        setOffset: function(e, t, n) {
            var i, o, r, s, a = S.css(e, "position"), l = S(e), c = {};
            "static" === a && (e.style.position = "relative"),
            r = l.offset(),
            i = S.css(e, "top"),
            s = S.css(e, "left"),
            a = ("absolute" === a || "fixed" === a) && -1 < (i + s).indexOf("auto") ? (o = (a = l.position()).top,
            a.left) : (o = parseFloat(i) || 0,
            parseFloat(s) || 0),
            null != (t = y(t) ? t.call(e, n, S.extend({}, r)) : t).top && (c.top = t.top - r.top + o),
            null != t.left && (c.left = t.left - r.left + a),
            "using"in t ? t.using.call(e, c) : l.css(c)
        }
    },
    S.fn.extend({
        offset: function(t) {
            var e, n;
            return arguments.length ? void 0 === t ? this : this.each(function(e) {
                S.offset.setOffset(this, t, e)
            }) : (n = this[0]) ? n.getClientRects().length ? (e = n.getBoundingClientRect(),
            n = n.ownerDocument.defaultView,
            {
                top: e.top + n.pageYOffset,
                left: e.left + n.pageXOffset
            }) : {
                top: 0,
                left: 0
            } : void 0
        },
        position: function() {
            if (this[0]) {
                var e, t, n, i = this[0], o = {
                    top: 0,
                    left: 0
                };
                if ("fixed" === S.css(i, "position"))
                    t = i.getBoundingClientRect();
                else {
                    for (t = this.offset(),
                    n = i.ownerDocument,
                    e = i.offsetParent || n.documentElement; e && (e === n.body || e === n.documentElement) && "static" === S.css(e, "position"); )
                        e = e.parentNode;
                    e && e !== i && 1 === e.nodeType && ((o = S(e).offset()).top += S.css(e, "borderTopWidth", !0),
                    o.left += S.css(e, "borderLeftWidth", !0))
                }
                return {
                    top: t.top - o.top - S.css(i, "marginTop", !0),
                    left: t.left - o.left - S.css(i, "marginLeft", !0)
                }
            }
        },
        offsetParent: function() {
            return this.map(function() {
                for (var e = this.offsetParent; e && "static" === S.css(e, "position"); )
                    e = e.offsetParent;
                return e || P
            })
        }
    }),
    S.each({
        scrollLeft: "pageXOffset",
        scrollTop: "pageYOffset"
    }, function(t, o) {
        var r = "pageYOffset" === o;
        S.fn[t] = function(e) {
            return d(this, function(e, t, n) {
                var i;
                if (g(e) ? i = e : 9 === e.nodeType && (i = e.defaultView),
                void 0 === n)
                    return i ? i[o] : e[t];
                i ? i.scrollTo(r ? i.pageXOffset : n, r ? n : i.pageYOffset) : e[t] = n
            }, t, e, arguments.length)
        }
    }),
    S.each(["top", "left"], function(e, n) {
        S.cssHooks[n] = Je(m.pixelPosition, function(e, t) {
            if (t)
                return t = Ye(e, n),
                rt.test(t) ? S(e).position()[n] + "px" : t
        })
    }),
    S.each({
        Height: "height",
        Width: "width"
    }, function(s, a) {
        S.each({
            padding: "inner" + s,
            content: a,
            "": "outer" + s
        }, function(i, r) {
            S.fn[r] = function(e, t) {
                var n = arguments.length && (i || "boolean" != typeof e)
                  , o = i || (!0 === e || !0 === t ? "margin" : "border");
                return d(this, function(e, t, n) {
                    var i;
                    return g(e) ? 0 === r.indexOf("outer") ? e["inner" + s] : e.document.documentElement["client" + s] : 9 === e.nodeType ? (i = e.documentElement,
                    Math.max(e.body["scroll" + s], i["scroll" + s], e.body["offset" + s], i["offset" + s], i["client" + s])) : void 0 === n ? S.css(e, t, o) : S.style(e, t, n, o)
                }, a, n ? e : void 0, n)
            }
        })
    }),
    S.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function(e, t) {
        S.fn[t] = function(e) {
            return this.on(t, e)
        }
    }),
    S.fn.extend({
        bind: function(e, t, n) {
            return this.on(e, null, t, n)
        },
        unbind: function(e, t) {
            return this.off(e, null, t)
        },
        delegate: function(e, t, n, i) {
            return this.on(t, e, n, i)
        },
        undelegate: function(e, t, n) {
            return 1 === arguments.length ? this.off(e, "**") : this.off(t, e || "**", n)
        },
        hover: function(e, t) {
            return this.mouseenter(e).mouseleave(t || e)
        }
    }),
    S.each("blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "), function(e, n) {
        S.fn[n] = function(e, t) {
            return 0 < arguments.length ? this.on(n, null, e, t) : this.trigger(n)
        }
    }),
    /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g)
      , on = (S.proxy = function(e, t) {
        var n, i;
        if ("string" == typeof t && (i = e[t],
        t = e,
        e = i),
        y(e))
            return n = h.call(arguments, 2),
            (i = function() {
                return e.apply(t || this, n.concat(h.call(arguments)))
            }
            ).guid = e.guid = e.guid || S.guid++,
            i
    }
    ,
    S.holdReady = function(e) {
        e ? S.readyWait++ : S.ready(!0)
    }
    ,
    S.isArray = Array.isArray,
    S.parseJSON = JSON.parse,
    S.nodeName = l,
    S.isFunction = y,
    S.isWindow = g,
    S.camelCase = b,
    S.type = p,
    S.now = Date.now,
    S.isNumeric = function(e) {
        var t = S.type(e);
        return ("number" === t || "string" === t) && !isNaN(e - parseFloat(e))
    }
    ,
    S.trim = function(e) {
        return null == e ? "" : (e + "").replace(nn, "")
    }
    ,
    "function" == typeof define && define.amd && define("jquery", [], function() {
        return S
    }),
    C.jQuery)
      , rn = C.$;
    return S.noConflict = function(e) {
        return C.$ === S && (C.$ = rn),
        e && C.jQuery === S && (C.jQuery = on),
        S
    }
    ,
    void 0 === W && (C.jQuery = C.$ = S),
    S
}),
Z = window,
ee = function(e, t) {
    "use strict";
    var n = Array.prototype.slice
      , i = e.console
      , d = void 0 === i ? function() {}
    : function(e) {
        i.error(e)
    }
    ;
    function o(l, c, u) {
        (u = u || t || e.jQuery) && (c.prototype.option || (c.prototype.option = function(e) {
            u.isPlainObject(e) && (this.options = u.extend(!0, this.options, e))
        }
        ),
        u.fn[l] = function(e) {
            return "string" == typeof e ? (t = this,
            o = e,
            r = n.call(arguments, 1),
            a = "$()." + l + '("' + o + '")',
            t.each(function(e, t) {
                var n, t;
                (t = u.data(t, l)) ? (n = t[o]) && "_" != o.charAt(0) ? (n = n.apply(t, r),
                s = void 0 === s ? n : s) : d(a + " is not a valid method") : d(l + " not initialized. Cannot call methods, i.e. " + a)
            }),
            void 0 !== s ? s : t) : (i = e,
            this.each(function(e, t) {
                var n = u.data(t, l);
                n ? (n.option(i),
                n._init()) : (n = new c(t,i),
                u.data(t, l, n))
            }),
            this);
            var i, t, o, r, s, a
        }
        ,
        r(u))
    }
    function r(e) {
        e && !e.bridget && (e.bridget = o)
    }
    return r(t || e.jQuery),
    o
}
,
"function" == typeof define && define.amd ? define("jquery-bridget/jquery-bridget", ["jquery"], function(e) {
    return ee(Z, e)
}) : "object" == typeof module && module.exports ? module.exports = ee(Z, require("jquery")) : Z.jQueryBridget = ee(Z, Z.jQuery),
se = "undefined" != typeof window ? window : this,
ne = function() {
    function e() {}
    var t = e.prototype;
    return t.on = function(e, t) {
        var n;
        if (e && t)
            return -1 == (n = (n = this._events = this._events || {})[e] = n[e] || []).indexOf(t) && n.push(t),
            this
    }
    ,
    t.once = function(e, t) {
        var n;
        if (e && t)
            return this.on(e, t),
            ((n = this._onceEvents = this._onceEvents || {})[e] = n[e] || {})[t] = !0,
            this
    }
    ,
    t.off = function(e, t) {
        if ((e = this._events && this._events[e]) && e.length)
            return -1 != (t = e.indexOf(t)) && e.splice(t, 1),
            this
    }
    ,
    t.emitEvent = function(e, t) {
        var n = this._events && this._events[e];
        if (n && n.length) {
            n = n.slice(0),
            t = t || [];
            for (var i = this._onceEvents && this._onceEvents[e], o = 0; o < n.length; o++) {
                var r = n[o];
                i && i[r] && (this.off(e, r),
                delete i[r]),
                r.apply(this, t)
            }
            return this
        }
    }
    ,
    t.allOff = function() {
        delete this._events,
        delete this._onceEvents
    }
    ,
    e
}
,
"function" == typeof define && define.amd ? define("ev-emitter/ev-emitter", ne) : "object" == typeof module && module.exports ? module.exports = ne() : se.EvEmitter = ne(),
se = window,
ne = function() {
    "use strict";
    function m(e) {
        var t = parseFloat(e);
        return -1 == e.indexOf("%") && !isNaN(t) && t
    }
    var t = "undefined" == typeof console ? function() {}
    : function(e) {}
      , g = ["paddingLeft", "paddingRight", "paddingTop", "paddingBottom", "marginLeft", "marginRight", "marginTop", "marginBottom", "borderLeftWidth", "borderRightWidth", "borderTopWidth", "borderBottomWidth"]
      , v = g.length;
    function b(e) {
        return (e = getComputedStyle(e)) || t("Style returned " + e + ". Are you running this code in a hidden iframe on Firefox? See https://bit.ly/getsizebug1"),
        e
    }
    var y, x = !1;
    function C(e) {
        if (x || (x = !0,
        (u = document.createElement("div")).style.width = "200px",
        u.style.padding = "1px 2px 3px 4px",
        u.style.borderStyle = "solid",
        u.style.borderWidth = "1px 2px 3px 4px",
        u.style.boxSizing = "border-box",
        (c = document.body || document.documentElement).appendChild(u),
        r = b(u),
        y = 200 == Math.round(m(r.width)),
        C.isBoxSizeOuter = y,
        c.removeChild(u)),
        (e = "string" == typeof e ? document.querySelector(e) : e) && "object" == typeof e && e.nodeType) {
            var t = b(e);
            if ("none" == t.display) {
                for (var n = {
                    width: 0,
                    height: 0,
                    innerWidth: 0,
                    innerHeight: 0,
                    outerWidth: 0,
                    outerHeight: 0
                }, i = 0; i < v; i++)
                    n[g[i]] = 0;
                return n
            }
            var o = {};
            o.width = e.offsetWidth,
            o.height = e.offsetHeight;
            for (var r = o.isBorderBox = "border-box" == t.boxSizing, s = 0; s < v; s++) {
                var a = g[s]
                  , l = t[a]
                  , l = parseFloat(l);
                o[a] = isNaN(l) ? 0 : l
            }
            var c = o.paddingLeft + o.paddingRight, u = o.paddingTop + o.paddingBottom, e = o.marginLeft + o.marginRight, d = o.marginTop + o.marginBottom, h = o.borderLeftWidth + o.borderRightWidth, f = o.borderTopWidth + o.borderBottomWidth, r = r && y, p = m(t.width), p;
            return !1 !== p && (o.width = p + (r ? 0 : c + h)),
            !1 !== (p = m(t.height)) && (o.height = p + (r ? 0 : u + f)),
            o.innerWidth = o.width - (c + h),
            o.innerHeight = o.height - (u + f),
            o.outerWidth = o.width + e,
            o.outerHeight = o.height + d,
            o
        }
        var u, c, r
    }
    return C
}
,
"function" == typeof define && define.amd ? define("get-size/get-size", ne) : "object" == typeof module && module.exports ? module.exports = ne() : se.getSize = ne(),
function(e, t) {
    "use strict";
    "function" == typeof define && define.amd ? define("desandro-matches-selector/matches-selector", t) : "object" == typeof module && module.exports ? module.exports = t() : e.matchesSelector = t()
}(window, function() {
    "use strict";
    var n = function() {
        var e = window.Element.prototype;
        if (e.matches)
            return "matches";
        if (e.matchesSelector)
            return "matchesSelector";
        for (var t = ["webkit", "moz", "ms", "o"], n = 0; n < t.length; n++) {
            var i = t[n] + "MatchesSelector";
            if (e[i])
                return i
        }
    }();
    return function(e, t) {
        return e[n](t)
    }
}),
Y = window,
J = function(n, r) {
    var l = {
        extend: function(e, t) {
            for (var n in t)
                e[n] = t[n];
            return e
        },
        modulo: function(e, t) {
            return (e % t + t) % t
        }
    }
      , t = Array.prototype.slice
      , c = (l.makeArray = function(e) {
        return Array.isArray(e) ? e : null == e ? [] : "object" == typeof e && "number" == typeof e.length ? t.call(e) : [e]
    }
    ,
    l.removeFrom = function(e, t) {
        -1 != (t = e.indexOf(t)) && e.splice(t, 1)
    }
    ,
    l.getParent = function(e, t) {
        for (; e.parentNode && e != document.body; )
            if (e = e.parentNode,
            r(e, t))
                return e
    }
    ,
    l.getQueryElement = function(e) {
        return "string" == typeof e ? document.querySelector(e) : e
    }
    ,
    l.handleEvent = function(e) {
        var t = "on" + e.type;
        this[t] && this[t](e)
    }
    ,
    l.filterFindElements = function(e, i) {
        e = l.makeArray(e);
        var o = [];
        return e.forEach(function(e) {
            if (e instanceof HTMLElement)
                if (i) {
                    r(e, i) && o.push(e);
                    for (var t = e.querySelectorAll(i), n = 0; n < t.length; n++)
                        o.push(t[n])
                } else
                    o.push(e)
        }),
        o
    }
    ,
    l.debounceMethod = function(e, t, i) {
        i = i || 100;
        var o = e.prototype[t]
          , r = t + "Timeout";
        e.prototype[t] = function() {
            var e = this[r]
              , t = (clearTimeout(e),
            arguments)
              , n = this;
            this[r] = setTimeout(function() {
                o.apply(n, t),
                delete n[r]
            }, i)
        }
    }
    ,
    l.docReady = function(e) {
        var t = document.readyState;
        "complete" == t || "interactive" == t ? setTimeout(e) : document.addEventListener("DOMContentLoaded", e)
    }
    ,
    l.toDashed = function(e) {
        return e.replace(/(.)([A-Z])/g, function(e, t, n) {
            return t + "-" + n
        }).toLowerCase()
    }
    ,
    n.console);
    return l.htmlInit = function(s, a) {
        l.docReady(function() {
            var e, i = "data-" + (e = l.toDashed(a)), t = document.querySelectorAll("[" + i + "]"), e = document.querySelectorAll(".js-" + e), t = l.makeArray(t).concat(l.makeArray(e)), o = i + "-options", r = n.jQuery;
            t.forEach(function(e) {
                var t, n = e.getAttribute(i) || e.getAttribute(o);
                try {
                    t = n && JSON.parse(n)
                } catch (t) {
                    return void (c && c.error("Error parsing " + i + " on " + e.className + ": " + t))
                }
                n = new s(e,t),
                r && r.data(e, a, n)
            })
        })
    }
    ,
    l
}
,
"function" == typeof define && define.amd ? define("fizzy-ui-utils/utils", ["desandro-matches-selector/matches-selector"], function(e) {
    return J(Y, e)
}) : "object" == typeof module && module.exports ? module.exports = J(Y, require("desandro-matches-selector")) : Y.fizzyUIUtils = J(Y, Y.matchesSelector),
se = window,
V = function(e, t) {
    function n(e, t) {
        this.element = e,
        this.parent = t,
        this.create()
    }
    var i = n.prototype;
    return i.create = function() {
        this.element.style.position = "absolute",
        this.element.setAttribute("aria-hidden", "true"),
        this.x = 0,
        this.shift = 0
    }
    ,
    i.destroy = function() {
        this.unselect(),
        this.element.style.position = "";
        var e = this.parent.originSide;
        this.element.style[e] = ""
    }
    ,
    i.getSize = function() {
        this.size = t(this.element)
    }
    ,
    i.setPosition = function(e) {
        this.x = e,
        this.updateTarget(),
        this.renderPosition(e)
    }
    ,
    i.updateTarget = i.setDefaultTarget = function() {
        var e = "left" == this.parent.originSide ? "marginLeft" : "marginRight";
        this.target = this.x + this.size[e] + this.size.width * this.parent.cellAlign
    }
    ,
    i.renderPosition = function(e) {
        var t = this.parent.originSide;
        this.element.style[t] = this.parent.getPositionValue(e)
    }
    ,
    i.select = function() {
        this.element.classList.add("is-selected"),
        this.element.removeAttribute("aria-hidden")
    }
    ,
    i.unselect = function() {
        this.element.classList.remove("is-selected"),
        this.element.setAttribute("aria-hidden", "true")
    }
    ,
    i.wrapShift = function(e) {
        this.shift = e,
        this.renderPosition(this.x + this.parent.slideableWidth * e)
    }
    ,
    i.remove = function() {
        this.element.parentNode.removeChild(this.element)
    }
    ,
    n
}
,
"function" == typeof define && define.amd ? define("flickity/js/cell", ["get-size/get-size"], function(e) {
    return V(0, e)
}) : "object" == typeof module && module.exports ? module.exports = V(0, require("get-size")) : (se.Flickity = se.Flickity || {},
se.Flickity.Cell = V(0, se.getSize)),
ne = window,
se = function() {
    "use strict";
    function e(e) {
        this.parent = e,
        this.isOriginLeft = "left" == e.originSide,
        this.cells = [],
        this.outerWidth = 0,
        this.height = 0
    }
    var t = e.prototype;
    return t.addCell = function(e) {
        var t;
        this.cells.push(e),
        this.outerWidth += e.size.outerWidth,
        this.height = Math.max(e.size.outerHeight, this.height),
        1 == this.cells.length && (this.x = e.x,
        t = this.isOriginLeft ? "marginLeft" : "marginRight",
        this.firstMargin = e.size[t])
    }
    ,
    t.updateTarget = function() {
        var e = this.isOriginLeft ? "marginRight" : "marginLeft", t, t = (t = this.getLastCell()) ? t.size[e] : 0, e = this.outerWidth - (this.firstMargin + t);
        this.target = this.x + this.firstMargin + e * this.parent.cellAlign
    }
    ,
    t.getLastCell = function() {
        return this.cells[this.cells.length - 1]
    }
    ,
    t.select = function() {
        this.cells.forEach(function(e) {
            e.select()
        })
    }
    ,
    t.unselect = function() {
        this.cells.forEach(function(e) {
            e.unselect()
        })
    }
    ,
    t.getCellElements = function() {
        return this.cells.map(function(e) {
            return e.element
        })
    }
    ,
    e
}
,
"function" == typeof define && define.amd ? define("flickity/js/slide", se) : "object" == typeof module && module.exports ? module.exports = se() : (ne.Flickity = ne.Flickity || {},
ne.Flickity.Slide = se()),
ne = window,
U = function(e, t) {
    return {
        startAnimation: function() {
            this.isAnimating || (this.isAnimating = !0,
            this.restingFrames = 0,
            this.animate())
        },
        animate: function() {
            this.applyDragForce(),
            this.applySelectedAttraction();
            var e, t = this.x;
            this.integratePhysics(),
            this.positionSlider(),
            this.settle(t),
            this.isAnimating && (e = this,
            requestAnimationFrame(function() {
                e.animate()
            }))
        },
        positionSlider: function() {
            var e = this.x;
            this.options.wrapAround && 1 < this.cells.length && (e = t.modulo(e, this.slideableWidth),
            e -= this.slideableWidth,
            this.shiftWrapCells(e)),
            this.setTranslateX(e, this.isAnimating),
            this.dispatchScrollEvent()
        },
        setTranslateX: function(e, t) {
            e += this.cursorPosition,
            e = this.options.rightToLeft ? -e : e,
            e = this.getPositionValue(e),
            this.slider.style.transform = t ? "translate3d(" + e + ",0,0)" : "translateX(" + e + ")"
        },
        dispatchScrollEvent: function() {
            var e, t = this.slides[0];
            t && (e = (t = -this.x - t.target) / this.slidesWidth,
            this.dispatchEvent("scroll", null, [e, t]))
        },
        positionSliderAtSelected: function() {
            this.cells.length && (this.x = -this.selectedSlide.target,
            this.velocity = 0,
            this.positionSlider())
        },
        getPositionValue: function(e) {
            return this.options.percentPosition ? .01 * Math.round(e / this.size.innerWidth * 1e4) + "%" : Math.round(e) + "px"
        },
        settle: function(e) {
            this.isPointerDown || Math.round(100 * this.x) != Math.round(100 * e) || this.restingFrames++,
            2 < this.restingFrames && (this.isAnimating = !1,
            delete this.isFreeScrolling,
            this.positionSlider(),
            this.dispatchEvent("settle", null, [this.selectedIndex]))
        },
        shiftWrapCells: function(e) {
            var t = this.cursorPosition + e
              , t = (this._shiftCells(this.beforeShiftCells, t, -1),
            this.size.innerWidth - (e + this.slideableWidth + this.cursorPosition));
            this._shiftCells(this.afterShiftCells, t, 1)
        },
        _shiftCells: function(e, t, n) {
            for (var i = 0; i < e.length; i++) {
                var o = e[i];
                o.wrapShift(0 < t ? n : 0),
                t -= o.size.outerWidth
            }
        },
        _unshiftCells: function(e) {
            if (e && e.length)
                for (var t = 0; t < e.length; t++)
                    e[t].wrapShift(0)
        },
        integratePhysics: function() {
            this.x += this.velocity,
            this.velocity *= this.getFrictionFactor()
        },
        applyForce: function(e) {
            this.velocity += e
        },
        getFrictionFactor: function() {
            return 1 - this.options[this.isFreeScrolling ? "freeScrollFriction" : "friction"]
        },
        getRestingPosition: function() {
            return this.x + this.velocity / (1 - this.getFrictionFactor())
        },
        applyDragForce: function() {
            var e;
            this.isDraggable && this.isPointerDown && (e = this.dragX - this.x - this.velocity,
            this.applyForce(e))
        },
        applySelectedAttraction: function() {
            var e;
            this.isDraggable && this.isPointerDown || this.isFreeScrolling || !this.slides.length || (e = (-1 * this.selectedSlide.target - this.x) * this.options.selectedAttraction,
            this.applyForce(e))
        }
    }
}
,
"function" == typeof define && define.amd ? define("flickity/js/animate", ["fizzy-ui-utils/utils"], function(e) {
    return U(0, e)
}) : "object" == typeof module && module.exports ? module.exports = U(0, require("fizzy-ui-utils")) : (ne.Flickity = ne.Flickity || {},
ne.Flickity.animatePrototype = U(0, ne.fizzyUIUtils)),
B = window,
R = function(i, e, t, s, n, a, o) {
    var r = i.jQuery
      , l = i.getComputedStyle
      , c = i.console;
    function u(e, t) {
        for (e = s.makeArray(e); e.length; )
            t.appendChild(e.shift())
    }
    var d = 0
      , h = {};
    function f(e, t) {
        var n, i = s.getQueryElement(e);
        if (i) {
            if (this.element = i,
            this.element.flickityGUID)
                return (n = h[this.element.flickityGUID]).option(t),
                n;
            r && (this.$element = r(this.element)),
            this.options = s.extend({}, this.constructor.defaults),
            this.option(t),
            this._create()
        } else
            c && c.error("Bad element for Flickity: " + (i || e))
    }
    f.defaults = {
        accessibility: !0,
        cellAlign: "center",
        freeScrollFriction: .075,
        friction: .28,
        namespaceJQueryEvents: !0,
        percentPosition: !0,
        resize: !0,
        selectedAttraction: .025,
        setGallerySize: !0
    },
    f.createMethods = [];
    var p = f.prototype
      , g = (s.extend(p, e.prototype),
    p._create = function() {
        var e, t = this.guid = ++d;
        for (e in this.element.flickityGUID = t,
        (h[t] = this).selectedIndex = 0,
        this.restingFrames = 0,
        this.x = 0,
        this.velocity = 0,
        this.originSide = this.options.rightToLeft ? "right" : "left",
        this.viewport = document.createElement("div"),
        this.viewport.className = "flickity-viewport",
        this._createSlider(),
        (this.options.resize || this.options.watchCSS) && i.addEventListener("resize", this),
        this.options.on) {
            var n = this.options.on[e];
            this.on(e, n)
        }
        f.createMethods.forEach(function(e) {
            this[e]()
        }, this),
        this.options.watchCSS ? this.watchCSS() : this.activate()
    }
    ,
    p.option = function(e) {
        s.extend(this.options, e)
    }
    ,
    p.activate = function() {
        this.isActive || (this.isActive = !0,
        this.element.classList.add("flickity-enabled"),
        this.options.rightToLeft && this.element.classList.add("flickity-rtl"),
        this.getSize(),
        u(this._filterFindCellElements(this.element.children), this.slider),
        this.viewport.appendChild(this.slider),
        this.element.appendChild(this.viewport),
        this.reloadCells(),
        this.options.accessibility && (this.element.tabIndex = 0,
        this.element.addEventListener("keydown", this)),
        this.emitEvent("activate"),
        this.selectInitialIndex(),
        this.isInitActivated = !0,
        this.dispatchEvent("ready"))
    }
    ,
    p._createSlider = function() {
        var e = document.createElement("div");
        e.className = "flickity-slider",
        e.style[this.originSide] = 0,
        this.slider = e
    }
    ,
    p._filterFindCellElements = function(e) {
        return s.filterFindElements(e, this.options.cellSelector)
    }
    ,
    p.reloadCells = function() {
        this.cells = this._makeCells(this.slider.children),
        this.positionCells(),
        this._getWrapShiftCells(),
        this.setGallerySize()
    }
    ,
    p._makeCells = function(e) {
        return this._filterFindCellElements(e).map(function(e) {
            return new n(e,this)
        }, this)
    }
    ,
    p.getLastCell = function() {
        return this.cells[this.cells.length - 1]
    }
    ,
    p.getLastSlide = function() {
        return this.slides[this.slides.length - 1]
    }
    ,
    p.positionCells = function() {
        this._sizeCells(this.cells),
        this._positionCells(0)
    }
    ,
    p._positionCells = function(e) {
        this.maxCellHeight = (e = e || 0) && this.maxCellHeight || 0;
        var t, n = 0;
        0 < e && (n = (t = this.cells[e - 1]).x + t.size.outerWidth);
        for (var i = this.cells.length, o = e; o < i; o++) {
            var r = this.cells[o];
            r.setPosition(n),
            n += r.size.outerWidth,
            this.maxCellHeight = Math.max(r.size.outerHeight, this.maxCellHeight)
        }
        this.slideableWidth = n,
        this.updateSlides(),
        this._containSlides(),
        this.slidesWidth = i ? this.getLastSlide().target - this.slides[0].target : 0
    }
    ,
    p._sizeCells = function(e) {
        e.forEach(function(e) {
            e.getSize()
        })
    }
    ,
    p.updateSlides = function() {
        var i, o, r;
        this.slides = [],
        this.cells.length && (i = new a(this),
        this.slides.push(i),
        o = "left" == this.originSide ? "marginRight" : "marginLeft",
        r = this._getCanCellFit(),
        this.cells.forEach(function(e, t) {
            var n;
            i.cells.length && (n = i.outerWidth - i.firstMargin + (e.size.outerWidth - e.size[o]),
            r.call(this, t, n) || (i.updateTarget(),
            i = new a(this),
            this.slides.push(i))),
            i.addCell(e)
        }, this),
        i.updateTarget(),
        this.updateSelectedSlide())
    }
    ,
    p._getCanCellFit = function() {
        var t, n, e = this.options.groupCells;
        return e ? "number" == typeof e ? (t = parseInt(e, 10),
        function(e) {
            return e % t != 0
        }
        ) : (e = "string" == typeof e && e.match(/^(\d+)%$/),
        n = e ? parseInt(e[1], 10) / 100 : 1,
        function(e, t) {
            return t <= (this.size.innerWidth + 1) * n
        }
        ) : function() {
            return !1
        }
    }
    ,
    p._init = p.reposition = function() {
        this.positionCells(),
        this.positionSliderAtSelected()
    }
    ,
    p.getSize = function() {
        this.size = t(this.element),
        this.setCellAlign(),
        this.cursorPosition = this.size.innerWidth * this.cellAlign
    }
    ,
    {
        center: {
            left: .5,
            right: .5
        },
        left: {
            left: 0,
            right: 1
        },
        right: {
            right: 0,
            left: 1
        }
    });
    return p.setCellAlign = function() {
        var e = g[this.options.cellAlign];
        this.cellAlign = e ? e[this.originSide] : this.options.cellAlign
    }
    ,
    p.setGallerySize = function() {
        var e;
        this.options.setGallerySize && (e = this.options.adaptiveHeight && this.selectedSlide ? this.selectedSlide.height : this.maxCellHeight,
        this.viewport.style.height = e + "px")
    }
    ,
    p._getWrapShiftCells = function() {
        var e, t;
        this.options.wrapAround && (this._unshiftCells(this.beforeShiftCells),
        this._unshiftCells(this.afterShiftCells),
        e = this.cursorPosition,
        t = this.cells.length - 1,
        this.beforeShiftCells = this._getGapCells(e, t, -1),
        e = this.size.innerWidth - this.cursorPosition,
        this.afterShiftCells = this._getGapCells(e, 0, 1))
    }
    ,
    p._getGapCells = function(e, t, n) {
        for (var i = []; 0 < e; ) {
            var o = this.cells[t];
            if (!o)
                break;
            i.push(o),
            t += n,
            e -= o.size.outerWidth
        }
        return i
    }
    ,
    p._containSlides = function() {
        var e, t, n, i, o, r;
        this.options.contain && !this.options.wrapAround && this.cells.length && (e = (t = this.options.rightToLeft) ? "marginRight" : "marginLeft",
        t = t ? "marginLeft" : "marginRight",
        n = this.slideableWidth - this.getLastCell().size[t],
        i = n < this.size.innerWidth,
        o = this.cursorPosition + this.cells[0].size[e],
        r = n - this.size.innerWidth * (1 - this.cellAlign),
        this.slides.forEach(function(e) {
            i ? e.target = n * this.cellAlign : (e.target = Math.max(e.target, o),
            e.target = Math.min(e.target, r))
        }, this))
    }
    ,
    p.dispatchEvent = function(e, t, n) {
        var i = t ? [t].concat(n) : n;
        this.emitEvent(e, i),
        r && this.$element && (i = e += this.options.namespaceJQueryEvents ? ".flickity" : "",
        t && ((t = r.Event(t)).type = e,
        i = t),
        this.$element.trigger(i, n))
    }
    ,
    p.select = function(e, t, n) {
        this.isActive && (e = parseInt(e, 10),
        this._wrapSelect(e),
        (this.options.wrapAround || t) && (e = s.modulo(e, this.slides.length)),
        this.slides[e]) && (t = this.selectedIndex,
        this.selectedIndex = e,
        this.updateSelectedSlide(),
        n ? this.positionSliderAtSelected() : this.startAnimation(),
        this.options.adaptiveHeight && this.setGallerySize(),
        this.dispatchEvent("select", null, [e]),
        e != t && this.dispatchEvent("change", null, [e]),
        this.dispatchEvent("cellSelect"))
    }
    ,
    p._wrapSelect = function(e) {
        var t = this.slides.length;
        if (!(this.options.wrapAround && 1 < t))
            return e;
        var n = s.modulo(e, t)
          , i = Math.abs(n - this.selectedIndex)
          , o = Math.abs(n + t - this.selectedIndex)
          , n = Math.abs(n - t - this.selectedIndex);
        !this.isDragSelect && o < i ? e += t : !this.isDragSelect && n < i && (e -= t),
        e < 0 ? this.x -= this.slideableWidth : t <= e && (this.x += this.slideableWidth)
    }
    ,
    p.previous = function(e, t) {
        this.select(this.selectedIndex - 1, e, t)
    }
    ,
    p.next = function(e, t) {
        this.select(this.selectedIndex + 1, e, t)
    }
    ,
    p.updateSelectedSlide = function() {
        var e = this.slides[this.selectedIndex];
        e && (this.unselectSelectedSlide(),
        (this.selectedSlide = e).select(),
        this.selectedCells = e.cells,
        this.selectedElements = e.getCellElements(),
        this.selectedCell = e.cells[0],
        this.selectedElement = this.selectedElements[0])
    }
    ,
    p.unselectSelectedSlide = function() {
        this.selectedSlide && this.selectedSlide.unselect()
    }
    ,
    p.selectInitialIndex = function() {
        var e, t = this.options.initialIndex;
        this.isInitActivated ? this.select(this.selectedIndex, !1, !0) : t && "string" == typeof t && this.queryCell(t) ? this.selectCell(t, !1, !0) : (e = 0,
        t && this.slides[t] && (e = t),
        this.select(e, !1, !0))
    }
    ,
    p.selectCell = function(e, t, n) {
        var e;
        (e = this.queryCell(e)) && (e = this.getCellSlideIndex(e),
        this.select(e, t, n))
    }
    ,
    p.getCellSlideIndex = function(e) {
        for (var t = 0; t < this.slides.length; t++)
            if (-1 != this.slides[t].cells.indexOf(e))
                return t
    }
    ,
    p.getCell = function(e) {
        for (var t = 0; t < this.cells.length; t++) {
            var n = this.cells[t];
            if (n.element == e)
                return n
        }
    }
    ,
    p.getCells = function(e) {
        e = s.makeArray(e);
        var t = [];
        return e.forEach(function(e) {
            (e = this.getCell(e)) && t.push(e)
        }, this),
        t
    }
    ,
    p.getCellElements = function() {
        return this.cells.map(function(e) {
            return e.element
        })
    }
    ,
    p.getParentCell = function(e) {
        return this.getCell(e) || (e = s.getParent(e, ".flickity-slider > *"),
        this.getCell(e))
    }
    ,
    p.getAdjacentCellElements = function(e, t) {
        if (!e)
            return this.selectedSlide.getCellElements();
        t = void 0 === t ? this.selectedIndex : t;
        var n = this.slides.length;
        if (n <= 1 + 2 * e)
            return this.getCellElements();
        for (var i = [], o = t - e; o <= t + e; o++) {
            var r = this.options.wrapAround ? s.modulo(o, n) : o, r;
            (r = this.slides[r]) && (i = i.concat(r.getCellElements()))
        }
        return i
    }
    ,
    p.queryCell = function(e) {
        if ("number" == typeof e)
            return this.cells[e];
        if ("string" == typeof e) {
            if (e.match(/^[#\.]?[\d\/]/))
                return;
            e = this.element.querySelector(e)
        }
        return this.getCell(e)
    }
    ,
    p.uiChange = function() {
        this.emitEvent("uiChange")
    }
    ,
    p.childUIPointerDown = function(e) {
        "touchstart" != e.type && e.preventDefault(),
        this.focus()
    }
    ,
    p.onresize = function() {
        this.watchCSS(),
        this.resize()
    }
    ,
    s.debounceMethod(f, "onresize", 150),
    p.resize = function() {
        var e;
        this.isActive && (this.getSize(),
        this.options.wrapAround && (this.x = s.modulo(this.x, this.slideableWidth)),
        this.positionCells(),
        this._getWrapShiftCells(),
        this.setGallerySize(),
        this.emitEvent("resize"),
        e = this.selectedElements && this.selectedElements[0],
        this.selectCell(e, !1, !0))
    }
    ,
    p.watchCSS = function() {
        this.options.watchCSS && (-1 != l(this.element, ":after").content.indexOf("flickity") ? this.activate() : this.deactivate())
    }
    ,
    p.onkeydown = function(e) {
        var t = document.activeElement && document.activeElement != this.element;
        this.options.accessibility && !t && (t = f.keyboardHandlers[e.keyCode]) && t.call(this)
    }
    ,
    f.keyboardHandlers = {
        37: function() {
            var e = this.options.rightToLeft ? "next" : "previous";
            this.uiChange(),
            this[e]()
        },
        39: function() {
            var e = this.options.rightToLeft ? "previous" : "next";
            this.uiChange(),
            this[e]()
        }
    },
    p.focus = function() {
        var e = i.pageYOffset;
        this.element.focus({
            preventScroll: !0
        }),
        i.pageYOffset != e && i.scrollTo(i.pageXOffset, e)
    }
    ,
    p.deactivate = function() {
        this.isActive && (this.element.classList.remove("flickity-enabled"),
        this.element.classList.remove("flickity-rtl"),
        this.unselectSelectedSlide(),
        this.cells.forEach(function(e) {
            e.destroy()
        }),
        this.element.removeChild(this.viewport),
        u(this.slider.children, this.element),
        this.options.accessibility && (this.element.removeAttribute("tabIndex"),
        this.element.removeEventListener("keydown", this)),
        this.isActive = !1,
        this.emitEvent("deactivate"))
    }
    ,
    p.destroy = function() {
        this.deactivate(),
        i.removeEventListener("resize", this),
        this.allOff(),
        this.emitEvent("destroy"),
        r && this.$element && r.removeData(this.element, "flickity"),
        delete this.element.flickityGUID,
        delete h[this.guid]
    }
    ,
    s.extend(p, o),
    f.data = function(e) {
        return (e = (e = s.getQueryElement(e)) && e.flickityGUID) && h[e]
    }
    ,
    s.htmlInit(f, "flickity"),
    r && r.bridget && r.bridget("flickity", f),
    f.setJQuery = function(e) {
        r = e
    }
    ,
    f.Cell = n,
    f.Slide = a,
    f
}
,
"function" == typeof define && define.amd ? define("flickity/js/flickity", ["ev-emitter/ev-emitter", "get-size/get-size", "fizzy-ui-utils/utils", "./cell", "./slide", "./animate"], function(e, t, n, i, o, r) {
    return R(B, e, t, n, i, o, r)
}) : "object" == typeof module && module.exports ? module.exports = R(B, require("ev-emitter"), require("get-size"), require("fizzy-ui-utils"), require("./cell"), require("./slide"), require("./animate")) : (se = B.Flickity,
B.Flickity = R(B, B.EvEmitter, B.getSize, B.fizzyUIUtils, se.Cell, se.Slide, se.animatePrototype)),
F = window,
W = function(i, e) {
    function t() {}
    var e, n = ((e = t.prototype = Object.create(e.prototype)).bindStartEvent = function(e) {
        this._bindStartEvent(e, !0)
    }
    ,
    e.unbindStartEvent = function(e) {
        this._bindStartEvent(e, !1)
    }
    ,
    e._bindStartEvent = function(e, t) {
        var t = void 0 === t || t ? "addEventListener" : "removeEventListener"
          , n = "mousedown";
        i.PointerEvent ? n = "pointerdown" : "ontouchstart"in i && (n = "touchstart"),
        e[t](n, this)
    }
    ,
    e.handleEvent = function(e) {
        var t = "on" + e.type;
        this[t] && this[t](e)
    }
    ,
    e.getTouch = function(e) {
        for (var t = 0; t < e.length; t++) {
            var n = e[t];
            if (n.identifier == this.pointerIdentifier)
                return n
        }
    }
    ,
    e.onmousedown = function(e) {
        var t = e.button;
        t && 0 !== t && 1 !== t || this._pointerDown(e, e)
    }
    ,
    e.ontouchstart = function(e) {
        this._pointerDown(e, e.changedTouches[0])
    }
    ,
    e.onpointerdown = function(e) {
        this._pointerDown(e, e)
    }
    ,
    e._pointerDown = function(e, t) {
        e.button || this.isPointerDown || (this.isPointerDown = !0,
        this.pointerIdentifier = void 0 !== t.pointerId ? t.pointerId : t.identifier,
        this.pointerDown(e, t))
    }
    ,
    e.pointerDown = function(e, t) {
        this._bindPostStartEvents(e),
        this.emitEvent("pointerDown", [e, t])
    }
    ,
    {
        mousedown: ["mousemove", "mouseup"],
        touchstart: ["touchmove", "touchend", "touchcancel"],
        pointerdown: ["pointermove", "pointerup", "pointercancel"]
    });
    return e._bindPostStartEvents = function(e) {
        e && ((e = n[e.type]).forEach(function(e) {
            i.addEventListener(e, this)
        }, this),
        this._boundPointerEvents = e)
    }
    ,
    e._unbindPostStartEvents = function() {
        this._boundPointerEvents && (this._boundPointerEvents.forEach(function(e) {
            i.removeEventListener(e, this)
        }, this),
        delete this._boundPointerEvents)
    }
    ,
    e.onmousemove = function(e) {
        this._pointerMove(e, e)
    }
    ,
    e.onpointermove = function(e) {
        e.pointerId == this.pointerIdentifier && this._pointerMove(e, e)
    }
    ,
    e.ontouchmove = function(e) {
        var t = this.getTouch(e.changedTouches);
        t && this._pointerMove(e, t)
    }
    ,
    e._pointerMove = function(e, t) {
        this.pointerMove(e, t)
    }
    ,
    e.pointerMove = function(e, t) {
        this.emitEvent("pointerMove", [e, t])
    }
    ,
    e.onmouseup = function(e) {
        this._pointerUp(e, e)
    }
    ,
    e.onpointerup = function(e) {
        e.pointerId == this.pointerIdentifier && this._pointerUp(e, e)
    }
    ,
    e.ontouchend = function(e) {
        var t = this.getTouch(e.changedTouches);
        t && this._pointerUp(e, t)
    }
    ,
    e._pointerUp = function(e, t) {
        this._pointerDone(),
        this.pointerUp(e, t)
    }
    ,
    e.pointerUp = function(e, t) {
        this.emitEvent("pointerUp", [e, t])
    }
    ,
    e._pointerDone = function() {
        this._pointerReset(),
        this._unbindPostStartEvents(),
        this.pointerDone()
    }
    ,
    e._pointerReset = function() {
        this.isPointerDown = !1,
        delete this.pointerIdentifier
    }
    ,
    e.pointerDone = function() {}
    ,
    e.onpointercancel = function(e) {
        e.pointerId == this.pointerIdentifier && this._pointerCancel(e, e)
    }
    ,
    e.ontouchcancel = function(e) {
        var t = this.getTouch(e.changedTouches);
        t && this._pointerCancel(e, t)
    }
    ,
    e._pointerCancel = function(e, t) {
        this._pointerDone(),
        this.pointerCancel(e, t)
    }
    ,
    e.pointerCancel = function(e, t) {
        this.emitEvent("pointerCancel", [e, t])
    }
    ,
    t.getPointerPoint = function(e) {
        return {
            x: e.pageX,
            y: e.pageY
        }
    }
    ,
    t
}
,
"function" == typeof define && define.amd ? define("unipointer/unipointer", ["ev-emitter/ev-emitter"], function(e) {
    return W(F, e)
}) : "object" == typeof module && module.exports ? module.exports = W(F, require("ev-emitter")) : F.Unipointer = W(F, F.EvEmitter),
I = window,
H = function(r, e) {
    function t() {}
    var n = t.prototype = Object.create(e.prototype)
      , i = (n.bindHandles = function() {
        this._bindHandles(!0)
    }
    ,
    n.unbindHandles = function() {
        this._bindHandles(!1)
    }
    ,
    n._bindHandles = function(e) {
        for (var t = (e = void 0 === e || e) ? "addEventListener" : "removeEventListener", n = e ? this._touchActionValue : "", i = 0; i < this.handles.length; i++) {
            var o = this.handles[i];
            this._bindStartEvent(o, e),
            o[t]("click", this),
            r.PointerEvent && (o.style.touchAction = n)
        }
    }
    ,
    n._touchActionValue = "none",
    n.pointerDown = function(e, t) {
        this.okayPointerDown(e) && (this.pointerDownPointer = t,
        e.preventDefault(),
        this.pointerDownBlur(),
        this._bindPostStartEvents(e),
        this.emitEvent("pointerDown", [e, t]))
    }
    ,
    {
        TEXTAREA: !0,
        INPUT: !0,
        SELECT: !0,
        OPTION: !0
    })
      , o = {
        radio: !0,
        checkbox: !0,
        button: !0,
        submit: !0,
        image: !0,
        file: !0
    };
    return n.okayPointerDown = function(e) {
        var t = i[e.target.nodeName], e = o[e.target.type], t;
        return (t = !t || e) || this._pointerReset(),
        t
    }
    ,
    n.pointerDownBlur = function() {
        var e = document.activeElement;
        e && e.blur && e != document.body && e.blur()
    }
    ,
    n.pointerMove = function(e, t) {
        var n = this._dragPointerMove(e, t);
        this.emitEvent("pointerMove", [e, t, n]),
        this._dragMove(e, t, n)
    }
    ,
    n._dragPointerMove = function(e, t) {
        var n = {
            x: t.pageX - this.pointerDownPointer.pageX,
            y: t.pageY - this.pointerDownPointer.pageY
        };
        return !this.isDragging && this.hasDragStarted(n) && this._dragStart(e, t),
        n
    }
    ,
    n.hasDragStarted = function(e) {
        return 3 < Math.abs(e.x) || 3 < Math.abs(e.y)
    }
    ,
    n.pointerUp = function(e, t) {
        this.emitEvent("pointerUp", [e, t]),
        this._dragPointerUp(e, t)
    }
    ,
    n._dragPointerUp = function(e, t) {
        this.isDragging ? this._dragEnd(e, t) : this._staticClick(e, t)
    }
    ,
    n._dragStart = function(e, t) {
        this.isDragging = !0,
        this.isPreventingClicks = !0,
        this.dragStart(e, t)
    }
    ,
    n.dragStart = function(e, t) {
        this.emitEvent("dragStart", [e, t])
    }
    ,
    n._dragMove = function(e, t, n) {
        this.isDragging && this.dragMove(e, t, n)
    }
    ,
    n.dragMove = function(e, t, n) {
        e.preventDefault(),
        this.emitEvent("dragMove", [e, t, n])
    }
    ,
    n._dragEnd = function(e, t) {
        this.isDragging = !1,
        setTimeout(function() {
            delete this.isPreventingClicks
        }
        .bind(this)),
        this.dragEnd(e, t)
    }
    ,
    n.dragEnd = function(e, t) {
        this.emitEvent("dragEnd", [e, t])
    }
    ,
    n.onclick = function(e) {
        this.isPreventingClicks && e.preventDefault()
    }
    ,
    n._staticClick = function(e, t) {
        this.isIgnoringMouseUp && "mouseup" == e.type || (this.staticClick(e, t),
        "mouseup" != e.type && (this.isIgnoringMouseUp = !0,
        setTimeout(function() {
            delete this.isIgnoringMouseUp
        }
        .bind(this), 400)))
    }
    ,
    n.staticClick = function(e, t) {
        this.emitEvent("staticClick", [e, t])
    }
    ,
    t.getPointerPoint = e.getPointerPoint,
    t
}
,
"function" == typeof define && define.amd ? define("unidragger/unidragger", ["unipointer/unipointer"], function(e) {
    return H(I, e)
}) : "object" == typeof module && module.exports ? module.exports = H(I, require("unipointer")) : I.Unidragger = H(I, I.Unipointer),
D = window,
A = function(n, e, t, r) {
    r.extend(e.defaults, {
        draggable: ">1",
        dragThreshold: 3
    }),
    e.createMethods.push("_createDrag");
    var i = e.prototype
      , o = (r.extend(i, t.prototype),
    i._touchActionValue = "pan-y",
    "createTouch"in document)
      , s = !1
      , a = (i._createDrag = function() {
        this.on("activate", this.onActivateDrag),
        this.on("uiChange", this._uiChangeDrag),
        this.on("deactivate", this.onDeactivateDrag),
        this.on("cellChange", this.updateDraggable),
        o && !s && (n.addEventListener("touchmove", function() {}),
        s = !0)
    }
    ,
    i.onActivateDrag = function() {
        this.handles = [this.viewport],
        this.bindHandles(),
        this.updateDraggable()
    }
    ,
    i.onDeactivateDrag = function() {
        this.unbindHandles(),
        this.element.classList.remove("is-draggable")
    }
    ,
    i.updateDraggable = function() {
        ">1" == this.options.draggable ? this.isDraggable = 1 < this.slides.length : this.isDraggable = this.options.draggable,
        this.isDraggable ? this.element.classList.add("is-draggable") : this.element.classList.remove("is-draggable")
    }
    ,
    i.bindDrag = function() {
        this.options.draggable = !0,
        this.updateDraggable()
    }
    ,
    i.unbindDrag = function() {
        this.options.draggable = !1,
        this.updateDraggable()
    }
    ,
    i._uiChangeDrag = function() {
        delete this.isFreeScrolling
    }
    ,
    i.pointerDown = function(e, t) {
        this.isDraggable ? this.okayPointerDown(e) && (this._pointerDownPreventDefault(e),
        this.pointerDownFocus(e),
        document.activeElement != this.element && this.pointerDownBlur(),
        this.dragX = this.x,
        this.viewport.classList.add("is-pointer-down"),
        this.pointerDownScroll = l(),
        n.addEventListener("scroll", this),
        this._pointerDownDefault(e, t)) : this._pointerDownDefault(e, t)
    }
    ,
    i._pointerDownDefault = function(e, t) {
        this.pointerDownPointer = {
            pageX: t.pageX,
            pageY: t.pageY
        },
        this._bindPostStartEvents(e),
        this.dispatchEvent("pointerDown", e, [t])
    }
    ,
    {
        INPUT: !0,
        TEXTAREA: !0,
        SELECT: !0
    });
    function l() {
        return {
            x: n.pageXOffset,
            y: n.pageYOffset
        }
    }
    return i.pointerDownFocus = function(e) {
        a[e.target.nodeName] || this.focus()
    }
    ,
    i._pointerDownPreventDefault = function(e) {
        var t = "touchstart" == e.type
          , n = "touch" == e.pointerType
          , i = a[e.target.nodeName];
        t || n || i || e.preventDefault()
    }
    ,
    i.hasDragStarted = function(e) {
        return Math.abs(e.x) > this.options.dragThreshold
    }
    ,
    i.pointerUp = function(e, t) {
        delete this.isTouchScrolling,
        this.viewport.classList.remove("is-pointer-down"),
        this.dispatchEvent("pointerUp", e, [t]),
        this._dragPointerUp(e, t)
    }
    ,
    i.pointerDone = function() {
        n.removeEventListener("scroll", this),
        delete this.pointerDownScroll
    }
    ,
    i.dragStart = function(e, t) {
        this.isDraggable && (this.dragStartPosition = this.x,
        this.startAnimation(),
        n.removeEventListener("scroll", this),
        this.dispatchEvent("dragStart", e, [t]))
    }
    ,
    i.pointerMove = function(e, t) {
        var n = this._dragPointerMove(e, t);
        this.dispatchEvent("pointerMove", e, [t, n]),
        this._dragMove(e, t, n)
    }
    ,
    i.dragMove = function(e, t, n) {
        var i, o;
        this.isDraggable && (e.preventDefault(),
        this.previousDragX = this.dragX,
        i = this.options.rightToLeft ? -1 : 1,
        this.options.wrapAround && (n.x = n.x % this.slideableWidth),
        i = this.dragStartPosition + n.x * i,
        !this.options.wrapAround && this.slides.length && (i = (i = (o = Math.max(-this.slides[0].target, this.dragStartPosition)) < i ? .5 * (i + o) : i) < (o = Math.min(-this.getLastSlide().target, this.dragStartPosition)) ? .5 * (i + o) : i),
        this.dragX = i,
        this.dragMoveTime = new Date,
        this.dispatchEvent("dragMove", e, [t, n]))
    }
    ,
    i.dragEnd = function(e, t) {
        var n, i;
        this.isDraggable && (this.options.freeScroll && (this.isFreeScrolling = !0),
        n = this.dragEndRestingSelect(),
        this.options.freeScroll && !this.options.wrapAround ? (i = this.getRestingPosition(),
        this.isFreeScrolling = -i > this.slides[0].target && -i < this.getLastSlide().target) : this.options.freeScroll || n != this.selectedIndex || (n += this.dragEndBoostSelect()),
        delete this.previousDragX,
        this.isDragSelect = this.options.wrapAround,
        this.select(n),
        delete this.isDragSelect,
        this.dispatchEvent("dragEnd", e, [t]))
    }
    ,
    i.dragEndRestingSelect = function() {
        var e = this.getRestingPosition()
          , t = Math.abs(this.getSlideDistance(-e, this.selectedIndex))
          , n = this._getClosestResting(e, t, 1)
          , e = this._getClosestResting(e, t, -1);
        return (n.distance < e.distance ? n : e).index
    }
    ,
    i._getClosestResting = function(e, t, n) {
        for (var i = this.selectedIndex, o = 1 / 0, r = this.options.contain && !this.options.wrapAround ? function(e, t) {
            return e <= t
        }
        : function(e, t) {
            return e < t
        }
        ; r(t, o) && (o = t,
        null !== (t = this.getSlideDistance(-e, i += n))); )
            t = Math.abs(t);
        return {
            distance: o,
            index: i - n
        }
    }
    ,
    i.getSlideDistance = function(e, t) {
        var n = this.slides.length, i = this.options.wrapAround && 1 < n, o = i ? r.modulo(t, n) : t, o;
        return (o = this.slides[o]) ? (i = i ? this.slideableWidth * Math.floor(t / n) : 0,
        e - (o.target + i)) : null
    }
    ,
    i.dragEndBoostSelect = function() {
        var e, t;
        return void 0 === this.previousDragX || !this.dragMoveTime || 100 < new Date - this.dragMoveTime ? 0 : (e = this.getSlideDistance(-this.dragX, this.selectedIndex),
        t = this.previousDragX - this.dragX,
        0 < e && 0 < t ? 1 : e < 0 && t < 0 ? -1 : 0)
    }
    ,
    i.staticClick = function(e, t) {
        var n, i = (n = this.getParentCell(e.target)) && n.element, n = n && this.cells.indexOf(n);
        this.dispatchEvent("staticClick", e, [t, i, n])
    }
    ,
    i.onscroll = function() {
        var e = l()
          , t = this.pointerDownScroll.x - e.x
          , e = this.pointerDownScroll.y - e.y;
        (3 < Math.abs(t) || 3 < Math.abs(e)) && this._pointerDone()
    }
    ,
    e
}
,
"function" == typeof define && define.amd ? define("flickity/js/drag", ["./flickity", "unidragger/unidragger", "fizzy-ui-utils/utils"], function(e, t, n) {
    return A(D, e, t, n)
}) : "object" == typeof module && module.exports ? module.exports = A(D, require("./flickity"), require("unidragger"), require("fizzy-ui-utils")) : D.Flickity = A(D, D.Flickity, D.Unidragger, D.fizzyUIUtils),
ne = window,
k = function(e, t, n, i) {
    "use strict";
    var o = "http://www.w3.org/2000/svg";
    function r(e, t) {
        this.direction = e,
        this.parent = t,
        this._create()
    }
    return (r.prototype = Object.create(n.prototype))._create = function() {
        this.isEnabled = !0,
        this.isPrevious = -1 == this.direction;
        var e = this.parent.options.rightToLeft ? 1 : -1;
        this.isLeft = this.direction == e;
        var e, t = ((e = this.element = document.createElement("button")).className = "flickity-button flickity-prev-next-button",
        e.className += this.isPrevious ? " previous" : " next",
        e.setAttribute("type", "button"),
        this.disable(),
        e.setAttribute("aria-label", this.isPrevious ? "Previous" : "Next"),
        this.createSVG());
        e.appendChild(t),
        this.parent.on("select", this.update.bind(this)),
        this.on("pointerDown", this.parent.childUIPointerDown.bind(this.parent))
    }
    ,
    r.prototype.activate = function() {
        this.bindStartEvent(this.element),
        this.element.addEventListener("click", this),
        this.parent.element.appendChild(this.element)
    }
    ,
    r.prototype.deactivate = function() {
        this.parent.element.removeChild(this.element),
        this.unbindStartEvent(this.element),
        this.element.removeEventListener("click", this)
    }
    ,
    r.prototype.createSVG = function() {
        var e = document.createElementNS(o, "svg")
          , t = (e.setAttribute("class", "flickity-button-icon"),
        e.setAttribute("viewBox", "0 0 100 100"),
        document.createElementNS(o, "path"))
          , n = "string" != typeof (n = this.parent.options.arrowShape) ? "M " + n.x0 + ",50 L " + n.x1 + "," + (n.y1 + 50) + " L " + n.x2 + "," + (n.y2 + 50) + " L " + n.x3 + ",50  L " + n.x2 + "," + (50 - n.y2) + " L " + n.x1 + "," + (50 - n.y1) + " Z" : n;
        return t.setAttribute("d", n),
        t.setAttribute("class", "arrow"),
        this.isLeft || t.setAttribute("transform", "translate(100, 100) rotate(180) "),
        e.appendChild(t),
        e
    }
    ,
    r.prototype.handleEvent = i.handleEvent,
    r.prototype.onclick = function() {
        var e;
        this.isEnabled && (this.parent.uiChange(),
        e = this.isPrevious ? "previous" : "next",
        this.parent[e]())
    }
    ,
    r.prototype.enable = function() {
        this.isEnabled || (this.element.disabled = !1,
        this.isEnabled = !0)
    }
    ,
    r.prototype.disable = function() {
        this.isEnabled && (this.element.disabled = !0,
        this.isEnabled = !1)
    }
    ,
    r.prototype.update = function() {
        var e = this.parent.slides;
        this.parent.options.wrapAround && 1 < e.length ? this.enable() : (e = e.length ? e.length - 1 : 0,
        e = this.isPrevious ? 0 : e,
        this[this.parent.selectedIndex == e ? "disable" : "enable"]())
    }
    ,
    r.prototype.destroy = function() {
        this.deactivate(),
        this.allOff()
    }
    ,
    i.extend(t.defaults, {
        prevNextButtons: !0,
        arrowShape: {
            x0: 10,
            x1: 60,
            y1: 50,
            x2: 70,
            y2: 40,
            x3: 30
        }
    }),
    t.createMethods.push("_createPrevNextButtons"),
    (n = t.prototype)._createPrevNextButtons = function() {
        this.options.prevNextButtons && (this.prevButton = new r(-1,this),
        this.nextButton = new r(1,this),
        this.on("activate", this.activatePrevNextButtons))
    }
    ,
    n.activatePrevNextButtons = function() {
        this.prevButton.activate(),
        this.nextButton.activate(),
        this.on("deactivate", this.deactivatePrevNextButtons)
    }
    ,
    n.deactivatePrevNextButtons = function() {
        this.prevButton.deactivate(),
        this.nextButton.deactivate(),
        this.off("deactivate", this.deactivatePrevNextButtons)
    }
    ,
    t.PrevNextButton = r,
    t
}
,
"function" == typeof define && define.amd ? define("flickity/js/prev-next-button", ["./flickity", "unipointer/unipointer", "fizzy-ui-utils/utils"], function(e, t, n) {
    return k(0, e, t, n)
}) : "object" == typeof module && module.exports ? module.exports = k(0, require("./flickity"), require("unipointer"), require("fizzy-ui-utils")) : k(0, ne.Flickity, ne.Unipointer, ne.fizzyUIUtils),
se = window,
S = function(e, t, n, i) {
    function o(e) {
        this.parent = e,
        this._create()
    }
    return (o.prototype = Object.create(n.prototype))._create = function() {
        this.holder = document.createElement("ol"),
        this.holder.className = "flickity-page-dots",
        this.dots = [],
        this.handleClick = this.onClick.bind(this),
        this.on("pointerDown", this.parent.childUIPointerDown.bind(this.parent))
    }
    ,
    o.prototype.activate = function() {
        this.setDots(),
        this.holder.addEventListener("click", this.handleClick),
        this.bindStartEvent(this.holder),
        this.parent.element.appendChild(this.holder)
    }
    ,
    o.prototype.deactivate = function() {
        this.holder.removeEventListener("click", this.handleClick),
        this.unbindStartEvent(this.holder),
        this.parent.element.removeChild(this.holder)
    }
    ,
    o.prototype.setDots = function() {
        var e = this.parent.slides.length - this.dots.length;
        0 < e ? this.addDots(e) : e < 0 && this.removeDots(-e)
    }
    ,
    o.prototype.addDots = function(e) {
        for (var t = document.createDocumentFragment(), n = [], i = this.dots.length, o = i + e, r = i; r < o; r++) {
            var s = document.createElement("li");
            s.className = "dot",
            s.setAttribute("aria-label", "Page dot " + (r + 1)),
            t.appendChild(s),
            n.push(s)
        }
        this.holder.appendChild(t),
        this.dots = this.dots.concat(n)
    }
    ,
    o.prototype.removeDots = function(e) {
        this.dots.splice(this.dots.length - e, e).forEach(function(e) {
            this.holder.removeChild(e)
        }, this)
    }
    ,
    o.prototype.updateSelected = function() {
        this.selectedDot && (this.selectedDot.className = "dot",
        this.selectedDot.removeAttribute("aria-current")),
        this.dots.length && (this.selectedDot = this.dots[this.parent.selectedIndex],
        this.selectedDot.className = "dot is-selected",
        this.selectedDot.setAttribute("aria-current", "step"))
    }
    ,
    o.prototype.onTap = o.prototype.onClick = function(e) {
        var e;
        "LI" == (e = e.target).nodeName && (this.parent.uiChange(),
        e = this.dots.indexOf(e),
        this.parent.select(e))
    }
    ,
    o.prototype.destroy = function() {
        this.deactivate(),
        this.allOff()
    }
    ,
    t.PageDots = o,
    i.extend(t.defaults, {
        pageDots: !0
    }),
    t.createMethods.push("_createPageDots"),
    (n = t.prototype)._createPageDots = function() {
        this.options.pageDots && (this.pageDots = new o(this),
        this.on("activate", this.activatePageDots),
        this.on("select", this.updateSelectedPageDots),
        this.on("cellChange", this.updatePageDots),
        this.on("resize", this.updatePageDots),
        this.on("deactivate", this.deactivatePageDots))
    }
    ,
    n.activatePageDots = function() {
        this.pageDots.activate()
    }
    ,
    n.updateSelectedPageDots = function() {
        this.pageDots.updateSelected()
    }
    ,
    n.updatePageDots = function() {
        this.pageDots.setDots()
    }
    ,
    n.deactivatePageDots = function() {
        this.pageDots.deactivate()
    }
    ,
    t.PageDots = o,
    t
}
,
"function" == typeof define && define.amd ? define("flickity/js/page-dots", ["./flickity", "unipointer/unipointer", "fizzy-ui-utils/utils"], function(e, t, n) {
    return S(0, e, t, n)
}) : "object" == typeof module && module.exports ? module.exports = S(0, require("./flickity"), require("unipointer"), require("fizzy-ui-utils")) : S(0, se.Flickity, se.Unipointer, se.fizzyUIUtils),
ne = window,
se = function(e, t, n) {
    function i(e) {
        this.parent = e,
        this.state = "stopped",
        this.onVisibilityChange = this.visibilityChange.bind(this),
        this.onVisibilityPlay = this.visibilityPlay.bind(this)
    }
    return (i.prototype = Object.create(e.prototype)).play = function() {
        "playing" != this.state && (document.hidden ? document.addEventListener("visibilitychange", this.onVisibilityPlay) : (this.state = "playing",
        document.addEventListener("visibilitychange", this.onVisibilityChange),
        this.tick()))
    }
    ,
    i.prototype.tick = function() {
        var e, t;
        "playing" == this.state && (e = "number" == typeof (e = this.parent.options.autoPlay) ? e : 3e3,
        (t = this).clear(),
        this.timeout = setTimeout(function() {
            t.parent.next(!0),
            t.tick()
        }, e))
    }
    ,
    i.prototype.stop = function() {
        this.state = "stopped",
        this.clear(),
        document.removeEventListener("visibilitychange", this.onVisibilityChange)
    }
    ,
    i.prototype.clear = function() {
        clearTimeout(this.timeout)
    }
    ,
    i.prototype.pause = function() {
        "playing" == this.state && (this.state = "paused",
        this.clear())
    }
    ,
    i.prototype.unpause = function() {
        "paused" == this.state && this.play()
    }
    ,
    i.prototype.visibilityChange = function() {
        this[document.hidden ? "pause" : "unpause"]()
    }
    ,
    i.prototype.visibilityPlay = function() {
        this.play(),
        document.removeEventListener("visibilitychange", this.onVisibilityPlay)
    }
    ,
    t.extend(n.defaults, {
        pauseAutoPlayOnHover: !0
    }),
    n.createMethods.push("_createPlayer"),
    (e = n.prototype)._createPlayer = function() {
        this.player = new i(this),
        this.on("activate", this.activatePlayer),
        this.on("uiChange", this.stopPlayer),
        this.on("pointerDown", this.stopPlayer),
        this.on("deactivate", this.deactivatePlayer)
    }
    ,
    e.activatePlayer = function() {
        this.options.autoPlay && (this.player.play(),
        this.element.addEventListener("mouseenter", this))
    }
    ,
    e.playPlayer = function() {
        this.player.play()
    }
    ,
    e.stopPlayer = function() {
        this.player.stop()
    }
    ,
    e.pausePlayer = function() {
        this.player.pause()
    }
    ,
    e.unpausePlayer = function() {
        this.player.unpause()
    }
    ,
    e.deactivatePlayer = function() {
        this.player.stop(),
        this.element.removeEventListener("mouseenter", this)
    }
    ,
    e.onmouseenter = function() {
        this.options.pauseAutoPlayOnHover && (this.player.pause(),
        this.element.addEventListener("mouseleave", this))
    }
    ,
    e.onmouseleave = function() {
        this.player.unpause(),
        this.element.removeEventListener("mouseleave", this)
    }
    ,
    n.Player = i,
    n
}
,
"function" == typeof define && define.amd ? define("flickity/js/player", ["ev-emitter/ev-emitter", "fizzy-ui-utils/utils", "./flickity"], se) : "object" == typeof module && module.exports ? module.exports = se(require("ev-emitter"), require("fizzy-ui-utils"), require("./flickity")) : se(ne.EvEmitter, ne.fizzyUIUtils, ne.Flickity),
se = window,
E = function(e, t, i) {
    var n = t.prototype;
    return n.insert = function(e, t) {
        var n, i, o, r, s, e;
        (e = this._makeCells(e)) && e.length && (n = this.cells.length,
        t = void 0 === t ? n : t,
        r = e,
        s = document.createDocumentFragment(),
        r.forEach(function(e) {
            s.appendChild(e.element)
        }),
        r = s,
        (i = t == n) ? this.slider.appendChild(r) : (o = this.cells[t].element,
        this.slider.insertBefore(r, o)),
        0 === t ? this.cells = e.concat(this.cells) : i ? this.cells = this.cells.concat(e) : (r = this.cells.splice(t, n - t),
        this.cells = this.cells.concat(e).concat(r)),
        this._sizeCells(e),
        this.cellChange(t, !0))
    }
    ,
    n.append = function(e) {
        this.insert(e, this.cells.length)
    }
    ,
    n.prepend = function(e) {
        this.insert(e, 0)
    }
    ,
    n.remove = function(e) {
        var n, e;
        (e = this.getCells(e)) && e.length && (n = this.cells.length - 1,
        e.forEach(function(e) {
            e.remove();
            var t = this.cells.indexOf(e);
            n = Math.min(t, n),
            i.removeFrom(this.cells, e)
        }, this),
        this.cellChange(n, !0))
    }
    ,
    n.cellSizeChange = function(e) {
        var e;
        (e = this.getCell(e)) && (e.getSize(),
        e = this.cells.indexOf(e),
        this.cellChange(e))
    }
    ,
    n.cellChange = function(e, t) {
        var n = this.selectedElement, n;
        this._positionCells(e),
        this._getWrapShiftCells(),
        this.setGallerySize(),
        (n = this.getCell(n)) && (this.selectedIndex = this.getCellSlideIndex(n)),
        this.selectedIndex = Math.min(this.slides.length - 1, this.selectedIndex),
        this.emitEvent("cellChange", [e]),
        this.select(this.selectedIndex),
        t && this.positionSliderAtSelected()
    }
    ,
    t
}
,
"function" == typeof define && define.amd ? define("flickity/js/add-remove-cell", ["./flickity", "fizzy-ui-utils/utils"], function(e, t) {
    return E(0, e, t)
}) : "object" == typeof module && module.exports ? module.exports = E(0, require("./flickity"), require("fizzy-ui-utils")) : E(0, se.Flickity, se.fizzyUIUtils),
ne = window,
w = function(e, t, o) {
    "use strict";
    t.createMethods.push("_createLazyload");
    var n = t.prototype;
    function i(e, t) {
        this.img = e,
        this.flickity = t,
        this.load()
    }
    return n._createLazyload = function() {
        this.on("select", this.lazyLoad)
    }
    ,
    n.lazyLoad = function() {
        var t, e = this.options.lazyLoad;
        e && (e = this.getAdjacentCellElements("number" == typeof e ? e : 0),
        t = [],
        e.forEach(function(e) {
            e = function(e) {
                if ("IMG" == e.nodeName) {
                    var t = e.getAttribute("data-flickity-lazyload")
                      , n = e.getAttribute("data-flickity-lazyload-src")
                      , i = e.getAttribute("data-flickity-lazyload-srcset");
                    if (t || n || i)
                        return [e]
                }
                return t = e.querySelectorAll("img[data-flickity-lazyload], img[data-flickity-lazyload-src], img[data-flickity-lazyload-srcset]"),
                o.makeArray(t)
            }(e),
            t = t.concat(e)
        }),
        t.forEach(function(e) {
            new i(e,this)
        }, this))
    }
    ,
    i.prototype.handleEvent = o.handleEvent,
    i.prototype.load = function() {
        this.img.addEventListener("load", this),
        this.img.addEventListener("error", this);
        var e = this.img.getAttribute("data-flickity-lazyload") || this.img.getAttribute("data-flickity-lazyload-src")
          , t = this.img.getAttribute("data-flickity-lazyload-srcset");
        this.img.src = e,
        t && this.img.setAttribute("srcset", t),
        this.img.removeAttribute("data-flickity-lazyload"),
        this.img.removeAttribute("data-flickity-lazyload-src"),
        this.img.removeAttribute("data-flickity-lazyload-srcset")
    }
    ,
    i.prototype.onload = function(e) {
        this.complete(e, "flickity-lazyloaded")
    }
    ,
    i.prototype.onerror = function(e) {
        this.complete(e, "flickity-lazyerror")
    }
    ,
    i.prototype.complete = function(e, t) {
        this.img.removeEventListener("load", this),
        this.img.removeEventListener("error", this);
        var n, n = (n = this.flickity.getParentCell(this.img)) && n.element;
        this.flickity.cellSizeChange(n),
        this.img.classList.add(t),
        this.flickity.dispatchEvent("lazyLoad", e, n)
    }
    ,
    t.LazyLoader = i,
    t
}
,
"function" == typeof define && define.amd ? define("flickity/js/lazyload", ["./flickity", "fizzy-ui-utils/utils"], function(e, t) {
    return w(0, e, t)
}) : "object" == typeof module && module.exports ? module.exports = w(0, require("./flickity"), require("fizzy-ui-utils")) : w(0, ne.Flickity, ne.fizzyUIUtils),
window,
se = function(e) {
    return e
}
,
"function" == typeof define && define.amd ? define("flickity/js/index", ["./flickity", "./drag", "./prev-next-button", "./page-dots", "./player", "./add-remove-cell", "./lazyload"], se) : "object" == typeof module && module.exports && (module.exports = se(require("./flickity"), require("./drag"), require("./prev-next-button"), require("./page-dots"), require("./player"), require("./add-remove-cell"), require("./lazyload"))),
ne = window,
se = function(n, i) {
    n.createMethods.push("_createAsNavFor");
    var e = n.prototype;
    return e._createAsNavFor = function() {
        this.on("activate", this.activateAsNavFor),
        this.on("deactivate", this.deactivateAsNavFor),
        this.on("destroy", this.destroyAsNavFor);
        var e, t = this.options.asNavFor;
        t && (e = this,
        setTimeout(function() {
            e.setNavCompanion(t)
        }))
    }
    ,
    e.setNavCompanion = function(e) {
        var t, e;
        e = i.getQueryElement(e),
        (e = n.data(e)) && e != this && (this.navCompanion = e,
        (t = this).onNavCompanionSelect = function() {
            t.navCompanionSelect()
        }
        ,
        e.on("select", this.onNavCompanionSelect),
        this.on("staticClick", this.onNavStaticClick),
        this.navCompanionSelect(!0))
    }
    ,
    e.navCompanionSelect = function(e) {
        var t, n, i = this.navCompanion && this.navCompanion.selectedCells;
        i && (t = i[0],
        i = (t = this.navCompanion.cells.indexOf(t)) + i.length - 1,
        n = Math.floor((i - t) * (n = this.navCompanion.cellAlign) + t),
        this.selectCell(n, !1, e),
        this.removeNavSelectedElements(),
        n >= this.cells.length || (e = this.cells.slice(t, 1 + i),
        this.navSelectedElements = e.map(function(e) {
            return e.element
        }),
        this.changeNavSelectedClass("add")))
    }
    ,
    e.changeNavSelectedClass = function(t) {
        this.navSelectedElements.forEach(function(e) {
            e.classList[t]("is-nav-selected")
        })
    }
    ,
    e.activateAsNavFor = function() {
        this.navCompanionSelect(!0)
    }
    ,
    e.removeNavSelectedElements = function() {
        this.navSelectedElements && (this.changeNavSelectedClass("remove"),
        delete this.navSelectedElements)
    }
    ,
    e.onNavStaticClick = function(e, t, n, i) {
        "number" == typeof i && this.navCompanion.selectCell(i)
    }
    ,
    e.deactivateAsNavFor = function() {
        this.removeNavSelectedElements()
    }
    ,
    e.destroyAsNavFor = function() {
        this.navCompanion && (this.navCompanion.off("select", this.onNavCompanionSelect),
        this.off("staticClick", this.onNavStaticClick),
        delete this.navCompanion)
    }
    ,
    n
}
,
"function" == typeof define && define.amd ? define("flickity-as-nav-for/as-nav-for", ["flickity/js/index", "fizzy-ui-utils/utils"], se) : "object" == typeof module && module.exports ? module.exports = se(require("flickity"), require("fizzy-ui-utils")) : ne.Flickity = se(ne.Flickity, ne.fizzyUIUtils),
function(t, n) {
    "use strict";
    "function" == typeof define && define.amd ? define("imagesloaded/imagesloaded", ["ev-emitter/ev-emitter"], function(e) {
        return n(t, e)
    }) : "object" == typeof module && module.exports ? module.exports = n(t, require("ev-emitter")) : t.imagesLoaded = n(t, t.EvEmitter)
}("undefined" != typeof window ? window : this, function(t, e) {
    var r = t.jQuery
      , s = t.console;
    function a(e, t) {
        for (var n in t)
            e[n] = t[n];
        return e
    }
    var l = Array.prototype.slice;
    function c(e, t, n) {
        if (!(this instanceof c))
            return new c(e,t,n);
        var i, o = e;
        (o = "string" == typeof e ? document.querySelectorAll(e) : o) ? (this.elements = (i = o,
        Array.isArray(i) ? i : "object" == typeof i && "number" == typeof i.length ? l.call(i) : [i]),
        this.options = a({}, this.options),
        "function" == typeof t ? n = t : a(this.options, t),
        n && this.on("always", n),
        this.getImages(),
        r && (this.jqDeferred = new r.Deferred),
        setTimeout(this.check.bind(this))) : s.error("Bad element for imagesLoaded " + (o || e))
    }
    (c.prototype = Object.create(e.prototype)).options = {},
    c.prototype.getImages = function() {
        this.images = [],
        this.elements.forEach(this.addElementImages, this)
    }
    ,
    c.prototype.addElementImages = function(e) {
        "IMG" == e.nodeName && this.addImage(e),
        !0 === this.options.background && this.addElementBackgroundImages(e);
        var t = e.nodeType;
        if (t && u[t]) {
            for (var n = e.querySelectorAll("img"), i = 0; i < n.length; i++) {
                var o = n[i];
                this.addImage(o)
            }
            if ("string" == typeof this.options.background)
                for (var r = e.querySelectorAll(this.options.background), i = 0; i < r.length; i++) {
                    var s = r[i];
                    this.addElementBackgroundImages(s)
                }
        }
    }
    ;
    var u = {
        1: !0,
        9: !0,
        11: !0
    };
    function n(e) {
        this.img = e
    }
    function i(e, t) {
        this.url = e,
        this.element = t,
        this.img = new Image
    }
    return c.prototype.addElementBackgroundImages = function(e) {
        var t = getComputedStyle(e);
        if (t)
            for (var n = /url\((['"])?(.*?)\1\)/gi, i = n.exec(t.backgroundImage); null !== i; ) {
                var o = i && i[2];
                o && this.addBackground(o, e),
                i = n.exec(t.backgroundImage)
            }
    }
    ,
    c.prototype.addImage = function(e) {
        e = new n(e),
        this.images.push(e)
    }
    ,
    c.prototype.addBackground = function(e, t) {
        e = new i(e,t),
        this.images.push(e)
    }
    ,
    c.prototype.check = function() {
        var i = this;
        function t(e, t, n) {
            setTimeout(function() {
                i.progress(e, t, n)
            })
        }
        this.progressedCount = 0,
        this.hasAnyBroken = !1,
        this.images.length ? this.images.forEach(function(e) {
            e.once("progress", t),
            e.check()
        }) : this.complete()
    }
    ,
    c.prototype.progress = function(e, t, n) {
        this.progressedCount++,
        this.hasAnyBroken = this.hasAnyBroken || !e.isLoaded,
        this.emitEvent("progress", [this, e, t]),
        this.jqDeferred && this.jqDeferred.notify && this.jqDeferred.notify(this, e),
        this.progressedCount == this.images.length && this.complete(),
        this.options.debug && s && s.log("progress: " + n, e, t)
    }
    ,
    c.prototype.complete = function() {
        var e = this.hasAnyBroken ? "fail" : "done";
        this.isComplete = !0,
        this.emitEvent(e, [this]),
        this.emitEvent("always", [this]),
        this.jqDeferred && (e = this.hasAnyBroken ? "reject" : "resolve",
        this.jqDeferred[e](this))
    }
    ,
    (n.prototype = Object.create(e.prototype)).check = function() {
        this.getIsImageComplete() ? this.confirm(0 !== this.img.naturalWidth, "naturalWidth") : (this.proxyImage = new Image,
        this.proxyImage.addEventListener("load", this),
        this.proxyImage.addEventListener("error", this),
        this.img.addEventListener("load", this),
        this.img.addEventListener("error", this),
        this.proxyImage.src = this.img.src)
    }
    ,
    n.prototype.getIsImageComplete = function() {
        return this.img.complete && this.img.naturalWidth
    }
    ,
    n.prototype.confirm = function(e, t) {
        this.isLoaded = e,
        this.emitEvent("progress", [this, this.img, t])
    }
    ,
    n.prototype.handleEvent = function(e) {
        var t = "on" + e.type;
        this[t] && this[t](e)
    }
    ,
    n.prototype.onload = function() {
        this.confirm(!0, "onload"),
        this.unbindEvents()
    }
    ,
    n.prototype.onerror = function() {
        this.confirm(!1, "onerror"),
        this.unbindEvents()
    }
    ,
    n.prototype.unbindEvents = function() {
        this.proxyImage.removeEventListener("load", this),
        this.proxyImage.removeEventListener("error", this),
        this.img.removeEventListener("load", this),
        this.img.removeEventListener("error", this)
    }
    ,
    (i.prototype = Object.create(n.prototype)).check = function() {
        this.img.addEventListener("load", this),
        this.img.addEventListener("error", this),
        this.img.src = this.url,
        this.getIsImageComplete() && (this.confirm(0 !== this.img.naturalWidth, "naturalWidth"),
        this.unbindEvents())
    }
    ,
    i.prototype.unbindEvents = function() {
        this.img.removeEventListener("load", this),
        this.img.removeEventListener("error", this)
    }
    ,
    i.prototype.confirm = function(e, t) {
        this.isLoaded = e,
        this.emitEvent("progress", [this, this.element, t])
    }
    ,
    (c.makeJQueryPlugin = function(e) {
        (e = e || t.jQuery) && ((r = e).fn.imagesLoaded = function(e, t) {
            return new c(this,e,t).jqDeferred.promise(r(this))
        }
        )
    }
    )(),
    c
}),
se = window,
x = function(e, t, i) {
    "use strict";
    t.createMethods.push("_createImagesLoaded");
    var n = t.prototype;
    return n._createImagesLoaded = function() {
        this.on("activate", this.imagesLoaded)
    }
    ,
    n.imagesLoaded = function() {
        var n;
        this.options.imagesLoaded && i((n = this).slider).on("progress", function(e, t) {
            t = n.getParentCell(t.img),
            n.cellSizeChange(t && t.element),
            n.options.freeScroll || n.positionSliderAtSelected()
        })
    }
    ,
    t
}
,
"function" == typeof define && define.amd ? define(["flickity/js/index", "imagesloaded/imagesloaded"], function(e, t) {
    return x(0, e, t)
}) : "object" == typeof module && module.exports ? module.exports = x(0, require("flickity"), require("imagesloaded")) : se.Flickity = x(0, se.Flickity, se.imagesLoaded),
function i(o, r, s) {
    function a(t, e) {
        if (!r[t]) {
            if (!o[t]) {
                var n = "function" == typeof require && require;
                if (!e && n)
                    return n(t, !0);
                if (l)
                    return l(t, !0);
                throw (e = new Error("Cannot find module '" + t + "'")).code = "MODULE_NOT_FOUND",
                e
            }
            n = r[t] = {
                exports: {}
            },
            o[t][0].call(n.exports, function(e) {
                return a(o[t][1][e] || e)
            }, n, n.exports, i, o, r, s)
        }
        return r[t].exports
    }
    for (var l = "function" == typeof require && require, e = 0; e < s.length; e++)
        a(s[e]);
    return a
}({
    1: [function(e, t, n) {
        try {
            var i = new window.CustomEvent("test");
            if (i.preventDefault(),
            !0 !== i.defaultPrevented)
                throw new Error("Could not prevent default")
        } catch (e) {
            function o(e, t) {
                var n, i;
                return t = t || {
                    bubbles: !1,
                    cancelable: !1,
                    detail: void 0
                },
                (n = document.createEvent("CustomEvent")).initCustomEvent(e, t.bubbles, t.cancelable, t.detail),
                i = n.preventDefault,
                n.preventDefault = function() {
                    i.call(this);
                    try {
                        Object.defineProperty(this, "defaultPrevented", {
                            get: function() {
                                return !0
                            }
                        })
                    } catch (e) {
                        this.defaultPrevented = !0
                    }
                }
                ,
                n
            }
            o.prototype = window.Event.prototype,
            window.CustomEvent = o
        }
    }
    , {}],
    2: [function(e, t, n) {
        "use strict";
        function i(e, t) {
            if (null == e)
                throw new TypeError("Cannot convert first argument to object");
            for (var n = Object(e), i = 1; i < arguments.length; i++) {
                var o = arguments[i];
                if (null != o)
                    for (var r = Object.keys(Object(o)), s = 0, a = r.length; s < a; s++) {
                        var l = r[s]
                          , c = Object.getOwnPropertyDescriptor(o, l);
                        void 0 !== c && c.enumerable && (n[l] = o[l])
                    }
            }
            return n
        }
        t.exports = {
            assign: i,
            polyfill: function() {
                Object.assign || Object.defineProperty(Object, "assign", {
                    enumerable: !1,
                    configurable: !0,
                    writable: !0,
                    value: i
                })
            }
        }
    }
    , {}],
    3: [function(e, t, n) {
        "use strict";
        function i(e) {
            e.fn.modalVideo = function(e) {
                return "strings" != typeof e && new o(this,e),
                this
            }
        }
        var o = e("../index");
        "function" == typeof define && define.amd ? define(["jquery"], i) : void 0 !== (e = window.jQuery || window.$) && i(e),
        t.exports = i
    }
    , {
        "../index": 5
    }],
    4: [function(e, t, n) {
        "use strict";
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var i = function(e, t, n) {
            return t && o(e.prototype, t),
            n && o(e, n),
            e
        };
        function o(e, t) {
            for (var n = 0; n < t.length; n++) {
                var i = t[n];
                i.enumerable = i.enumerable || !1,
                i.configurable = !0,
                "value"in i && (i.writable = !0),
                Object.defineProperty(e, i.key, i)
            }
        }
        e("custom-event-polyfill");
        var d = e("../lib/util")
          , r = e("es6-object-assign").assign
          , h = {
            channel: "youtube",
            facebook: {},
            youtube: {
                autoplay: 1,
                cc_load_policy: 1,
                color: null,
                controls: 1,
                disablekb: 0,
                enablejsapi: 0,
                end: null,
                fs: 1,
                h1: null,
                iv_load_policy: 1,
                list: null,
                listType: null,
                loop: 0,
                modestbranding: null,
                origin: null,
                playlist: null,
                playsinline: null,
                rel: 0,
                showinfo: 1,
                start: 0,
                wmode: "transparent",
                theme: "dark",
                nocookie: !1
            },
            ratio: "16:9",
            vimeo: {
                api: !1,
                autopause: !0,
                autoplay: !0,
                byline: !0,
                callback: null,
                color: null,
                height: null,
                loop: !1,
                maxheight: null,
                maxwidth: null,
                player_id: null,
                portrait: !0,
                title: !0,
                width: null,
                xhtml: !1
            },
            allowFullScreen: !0,
            animationSpeed: 300,
            classNames: {
                modalVideo: "modal-video",
                modalVideoClose: "modal-video-close",
                modalVideoBody: "modal-video-body",
                modalVideoInner: "modal-video-inner",
                modalVideoIframeWrap: "modal-video-movie-wrap",
                modalVideoCloseBtn: "modal-video-close-btn"
            },
            aria: {
                openMessage: "You just openned the modal video",
                dismissBtnMessage: "Close the modal by clicking here"
            }
        }
          , e = (i(f, [{
            key: "getPadding",
            value: function(e) {
                var e = e.split(":")
                  , t = Number(e[0]);
                return 100 * Number(e[1]) / t + "%"
            }
        }, {
            key: "getQueryString",
            value: function(t) {
                var n = "";
                return Object.keys(t).forEach(function(e) {
                    n += e + "=" + t[e] + "&"
                }),
                n.substr(0, n.length - 1)
            }
        }, {
            key: "getVideoUrl",
            value: function(e, t, n) {
                return "youtube" === t ? this.getYoutubeUrl(e.youtube, n) : "vimeo" === t ? this.getVimeoUrl(e.vimeo, n) : "facebook" === t ? this.getFacebookUrl(e.facebook, n) : ""
            }
        }, {
            key: "getVimeoUrl",
            value: function(e, t) {
                return "//player.vimeo.com/video/" + t + "?" + this.getQueryString(e)
            }
        }, {
            key: "getYoutubeUrl",
            value: function(e, t) {
                var n = this.getQueryString(e);
                return !0 === e.nocookie ? "//www.youtube-nocookie.com/embed/" + t + "?" + n : "//www.youtube.com/embed/" + t + "?" + n
            }
        }, {
            key: "getFacebookUrl",
            value: function(e, t) {
                return "//www.facebook.com/v2.10/plugins/video.php?href=https://www.facebook.com/facebook/videos/" + t + "&" + this.getQueryString(e)
            }
        }, {
            key: "getHtml",
            value: function(e, t, n) {
                var i = this.getPadding(e.ratio)
                  , o = e.classNames;
                return '\n      <div class="' + o.modalVideo + '" tabindex="-1" role="dialog" aria-label="' + e.aria.openMessage + '" id="' + n + '">\n        <div class="' + o.modalVideoBody + '">\n          <div class="' + o.modalVideoInner + '">\n            <div class="' + o.modalVideoIframeWrap + '" style="padding-bottom:' + i + '">\n              <button class="' + o.modalVideoCloseBtn + ' js-modal-video-dismiss-btn" aria-label="' + e.aria.dismissBtnMessage + "\"></button>\n              <iframe width='460' height='230' src=\"" + t + "\" frameborder='0' allowfullscreen=" + e.allowFullScreen + ' tabindex="-1"/>\n            </div>\n          </div>\n        </div>\n      </div>\n    '
            }
        }]),
        f);
        function f(e, t) {
            var s = this;
            if (!(this instanceof f))
                throw new TypeError("Cannot call a class as a function");
            var a = r({}, h, t)
              , t = "string" == typeof e ? document.querySelectorAll(e) : e
              , l = document.querySelector("body")
              , c = a.classNames
              , u = a.animationSpeed;
            [].forEach.call(t, function(r) {
                r.addEventListener("click", function(e) {
                    "A" === r.tagName && e.preventDefault();
                    var e = r.dataset.videoId
                      , t = r.dataset.channel || a.channel
                      , n = (0,
                    d.getUniqId)()
                      , t = r.dataset.videoUrl || s.getVideoUrl(a, t, e)
                      , e = s.getHtml(a, t, n)
                      , i = ((0,
                    d.append)(l, e),
                    document.getElementById(n))
                      , o = i.querySelector(".js-modal-video-dismiss-btn");
                    i.focus(),
                    i.addEventListener("click", function() {
                        (0,
                        d.addClass)(i, c.modalVideoClose),
                        setTimeout(function() {
                            (0,
                            d.remove)(i),
                            r.focus()
                        }, u)
                    }),
                    i.addEventListener("keydown", function(e) {
                        9 === e.which && (e.preventDefault(),
                        (document.activeElement === i ? o : (i.setAttribute("aria-label", ""),
                        i)).focus())
                    }),
                    o.addEventListener("click", function() {
                        (0,
                        d.triggerEvent)(i, "click")
                    })
                })
            })
        }
        n.default = e,
        t.exports = n.default
    }
    , {
        "../lib/util": 6,
        "custom-event-polyfill": 1,
        "es6-object-assign": 2
    }],
    5: [function(e, t, n) {
        "use strict";
        t.exports = e("./core/")
    }
    , {
        "./core/": 4
    }],
    6: [function(e, t, n) {
        "use strict";
        Object.defineProperty(n, "__esModule", {
            value: !0
        }),
        n.append = function(e, t) {
            var n = document.createElement("div");
            for (n.innerHTML = t; 0 < n.children.length; )
                e.appendChild(n.children[0])
        }
        ,
        n.getUniqId = function() {
            return (Date.now().toString(36) + Math.random().toString(36).substr(2, 5)).toUpperCase()
        }
        ,
        n.remove = function(e) {
            e && e.parentNode && e.parentNode.removeChild(e)
        }
        ,
        n.addClass = function(e, t) {
            e.classList ? e.classList.add(t) : e.className += " " + t
        }
        ,
        n.triggerEvent = function(e, t, n) {
            var i = void 0;
            window.CustomEvent ? i = new CustomEvent(t,{
                cancelable: !0
            }) : (i = document.createEvent("CustomEvent")).initCustomEvent(t, !1, !1, n),
            e.dispatchEvent(i)
        }
    }
    , {}]
}, {}, [3]),
(te = jQuery).fn.viewbox = function(d) {
    function t() {
        m && (g.fadeOut(d.closeDuration, function() {
            g.detach()
        }),
        m = !1)
    }
    function n(e) {
        return g.find(".viewbox-" + e)
    }
    function i(e, t) {
        n(e).html(t)
    }
    function o() {
        var t = -1;
        return p && s.each(function(e) {
            return p.is(this) ? (t = e,
            !1) : void 0
        }),
        t
    }
    function r() {
        var e;
        s.length <= 1 || ((e = o() + 1) >= s.length && (e = 0),
        s.eq(e).click())
    }
    function h(e) {
        return e.get(0).complete
    }
    function f(e) {
        e ? a.appendTo(n("body")) : a.detach()
    }
    function e(e) {
        var t = te('<div class="viewbox-button-default viewbox-button-' + e + '"></div>');
        return t.appendTo(g).get(0).insertAdjacentHTML("afterbegin", '<svg><use xlink:href="#viewbox-' + e + '-icon"/></svg>'),
        t
    }
    void 0 === d && (d = {}),
    d = te.extend({
        template: '<div class="viewbox-container"><div class="viewbox-body"><div class="viewbox-header"></div><div class="viewbox-content"></div><div class="viewbox-footer"></div></div></div>',
        loader: '<div class="loader"><div class="spinner"><div class="double-bounce1"></div><div class="double-bounce2"></div></div></div>',
        setTitle: !0,
        margin: 20,
        resizeDuration: 300,
        openDuration: 200,
        closeDuration: 200,
        closeButton: !0,
        navButtons: !0,
        closeOnSideClick: !0,
        nextOnContentClick: !0
    }, d);
    var p, s = te(this), g = te(d.template), a = te(d.loader), m = !1, v = !1;
    return te("body").get(0).insertAdjacentHTML("afterbegin", '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" id="viewbox-sprite" style="display:none"><symbol id="viewbox-close-icon" viewBox="0 0 50 50"><path d="M37.304 11.282l1.414 1.414-26.022 26.02-1.414-1.413z"/><path d="M12.696 11.282l26.022 26.02-1.414 1.415-26.022-26.02z"/></symbol><symbol id="viewbox-prev-icon" viewBox="0 0 50 50"><path d="M27.3 34.7L17.6 25l9.7-9.7 1.4 1.4-8.3 8.3 8.3 8.3z"/></symbol><symbol id="viewbox-next-icon" viewBox="0 0 50 50"><path d="M22.7 34.7l-1.4-1.4 8.3-8.3-8.3-8.3 1.4-1.4 9.7 9.7z"/></symbol></svg>'),
    s.click(function() {
        var s, a, l, c, u, e;
        if (!v)
            return $e = te(this),
            i("header", d.setTitle && $e.attr("title") ? $e.attr("title") : ""),
            $e.attr("href").match(/(png|jpg|jpeg|gif)$/i) && (s = te('<img class="viewbox-image" alt="">').attr("src", $e.attr("href")),
            p = $e,
            i("content", ""),
            m || (te("body").append(g),
            g.fadeIn(d.openDuration),
            m = !0),
            (e = n("body")).css({
                "margin-left": -e.width() / 2,
                "margin-top": -e.height() / 2
            }),
            h(s) || f(!0),
            a = n("body"),
            l = 0,
            c = n("content"),
            u = window.setInterval(function() {
                var e, t, n, i, o, r;
                !h(s) && l < 1e3 ? l++ : (window.clearInterval(u),
                f(!1),
                te("body").append(s),
                e = a.width() - c.width() + 2 * d.margin,
                t = a.height() - c.height() + 2 * d.margin,
                n = te(window).width() - e,
                i = te(window).height() - t,
                o = s.width(),
                r = s.height(),
                s.detach(),
                n < o && (r = r * n / o,
                o = n),
                i < r && (o = o * i / r,
                r = i),
                v = !0,
                a.animate({
                    "margin-left": -(o + e) / 2 + d.margin,
                    "margin-top": -(r + t) / 2 + d.margin
                }, d.resizeDuration),
                c.animate({
                    width: o,
                    height: r
                }, d.resizeDuration, function() {
                    c.append(s),
                    v = !1
                }))
            }, h(s) ? 0 : 200)),
            !1
    }),
    n("body").click(function(e) {
        e.stopPropagation(),
        d.nextOnContentClick && r()
    }),
    d.closeButton && e("close").click(function(e) {
        e.stopPropagation(),
        t()
    }),
    d.navButtons && 1 < s.length && (e("next").click(function(e) {
        e.stopPropagation(),
        r()
    }),
    e("prev").click(function(e) {
        e.stopPropagation(),
        s.length <= 1 || ((e = o() - 1) < 0 && (e = s.length - 1),
        s.eq(e).click())
    })),
    d.closeOnSideClick && g.click(t),
    this
}
,
document.addEventListener("DOMContentLoaded", e => {
    const t = document.getElementById("notification");
    t && setTimeout( () => {
        t.classList.add("open")
    }
    , 3e3)
}
),
$(document).on("change", "#menu_toggle", function() {
    $("body").toggleClass("open-popup")
}),
$(document).on("change", "#search__toggle", function() {
    $("body").toggleClass("open-popup")
}),
$(".card-order__link").click(function(e) {
    e.preventDefault();
    var e, t = (e = $(this)).data("tab"), n = $(".card-order__tab__item");
    $(".card-order__link").removeClass("active"),
    e.addClass("active"),
    n.removeClass("active");
    for (let e = 0; e < n.length; e++)
        n.eq(e).data("tab") == t && n.eq(e).addClass("active")
}),
window.addEventListener("resize", e),
e(),
$(".popup__close, .popup__blur").click(function() {
    $(".popup").removeClass("open")
}),
$(".menu__list__item.have-sub").click(function(e) {
    e.preventDefault();
    var e, t = (e = $(this)).data("sub"), n = $(".menu__sub");
    $(".menu__list__item.have-sub").removeClass("active"),
    e.addClass("active"),
    n.removeClass("active"),
    $(".menu").addClass("open-sub"),
    $(".menu__back ").addClass("active");
    for (let e = 0; e < n.length; e++)
        n.eq(e).data("sub") == t && n.eq(e).addClass("active")
}),
$(".menu__back").click(function(e) {
    $(".menu").removeClass("open-sub"),
    $(".menu__sub").removeClass("active"),
    $(this).removeClass("active")
}),
$(document).on("change", "#menu_toggle", function() {
    $(".menu").removeClass("open-sub"),
    $(".menu__sub").removeClass("active"),
    $(".menu__back").removeClass("active")
}),
$(".menu__list__item").click(function(e) {
    $(this).hasClass("have-sub") || ($(".menu__sub").removeClass("active"),
    $(".menu__list__item.have-sub").removeClass("active"))
}),
$(".menu__sub__item >li >a.have-sub").click(function(e) {
    e.preventDefault(),
    $(this).toggleClass("active"),
    $(this).next().stop(!0, !0).slideToggle()
}),
$(document).ready(function() {
    $("#parcel_search").focus(function() {
        $(".banner__search").addClass("open"),
        $(".banner__search >h2").slideDown(),
        $("body").addClass("open-popup")
    })
}),
$(".banner__search__blur").click(function(e) {
    e.preventDefault(),
    $(".banner__search").removeClass("open"),
    $(".banner__search >h2").slideUp(),
    $("body").removeClass("open-popup")
}),
991 < $(window).width() && document.querySelectorAll(".plane_banner").forEach(function(e, t) {
    let n = gsap.timeline({
        paused: !0
    });
    n.to(e.querySelector(".plane1"), {
        x: () => -e.offsetWidth - 300,
        y: () => -e.offsetHeight,
        duration: .3,
        ease: "power1.in"
    }),
    n.to(e.querySelector(".bg1"), {
        scale: 3,
        duration: .2,
        ease: "power1.in"
    }, "<.2"),
    n.add("mouseEnter"),
    n.to(e.querySelector(".bg1"), {
        x: () => -1.5 * e.offsetWidth,
        y: () => -1.5 * e.offsetHeight,
        scale: 1,
        duration: .3
    }),
    n.to(e.querySelector(".bg2"), {
        x: () => .46 * -e.offsetWidth,
        y: () => .72 * -e.offsetHeight,
        duration: .2
    }, "<.2"),
    n.to(e.querySelector(".plane2"), {
        x: () => .55 * -e.offsetWidth,
        y: () => -e.offsetHeight,
        duration: .2,
        ease: "power1.out"
    }, "<.1"),
    n.add("mouseLeave"),
    e.addEventListener("mouseenter", () => {
        n.pause(0).tweenTo("mouseEnter", 0)
    }
    ),
    e.addEventListener("mouseout", () => {
        n.tweenTo("mouseLeave", {
            ease: "power1.out",
            duration: 1
        })
    }
    )
}),
$(".video-item").modalVideo({
    youtube: {
        autoplay: !0,
        controls: 1,
        title: !1,
        portrait: !1,
        byline: !1
    }
}),
$(".similar-block__slider").flickity({
    cellAlign: "left",
    contain: !0,
    pageDots: !1,
    prevNextButtons: !1
});
var ne = $(".similar-block__arrow-next")
  , se = ($(".similar-block__arrow-prev"),
ne.on("click", function() {
    $(".similar-block__slider").flickity("next")
}),
$(".faq__head").click(function(e) {
    e.preventDefault(),
    $(this).toggleClass("active").next().stop(!0, !0).slideToggle()
}),
$(window).scroll(function() {
    var e = $(".footer").offset().top - 500;
    $(window).scrollTop() > e ? ($(".toolbar").addClass("hide"),
    $(".notification").addClass("hide"),
    $(".vacancies__info").addClass("hide")) : ($(".toolbar").removeClass("hide"),
    $(".notification").removeClass("hide"),
    $(".vacancies__info").removeClass("hide"))
}),
$(".notification__close,.notification__blur").click(function(e) {
    e.preventDefault(),
    $(".notification").removeClass("open"),
    document.cookie = "notification=yes"
}),
$(document).ready(function() {
    $(".activity__wrapper .row").hide(),
    $(".activity__wrapper .row").slice(0, 2).show(),
    $(".activity .vacancies__more").click(function(e) {
        e.preventDefault(),
        $(".activity__wrapper .row:hidden").show(),
        $(this).hide()
    })
}),
Fancybox.bind("[data-fancybox]", {}),
gsap.registerPlugin(ScrollTrigger),
document.querySelector(".gallery__img--full"));
document.querySelector(".gallery__desc--end"),
gsap.timeline({
    scrollTrigger: {
        trigger: se,
        start: "center-=300 center",
        end: "bottom top",
        toggleActions: "play none none reverse"
    }
}).fromTo(se, 1, {
    scale: "2"
}, {
    scale: "1",
    ease: Power2.easeInOut
}).fromTo(se, .5, {
    width: "260%"
}, {
    width: "100%",
    ease: Power2.easeInOut
}),
$(".open-acc").click(function(e) {
    e.preventDefault(),
    $(this).parent().find(".network__index").toggle(),
    $(this).toggleClass("active").parent().find(".network__list__all").stop(!0, !0).slideToggle()
}),
document.querySelectorAll('.services-apply__radio input[type="radio"]').forEach(e => {
    e.addEventListener("change", function() {
        this.checked && this.nextElementSibling.scrollIntoView({
            behavior: "smooth",
            inline: "center"
        })
    })
}
),
window.addEventListener("DOMContentLoaded", function() {
    var e = document.querySelector(".faq__filter__item.active");
    e && e.scrollIntoView({
        behavior: "smooth",
        inline: "center"
    })
});
