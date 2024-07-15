/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    // Cordova is now initialized. Have fun!

    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    document.getElementById('deviceready').classList.add('ready');
	
}


! function() {

  var today = moment();

  function Calendar(selector, events) {
    this.el = document.querySelector(selector);
    this.events = events;
    this.maxEvents = this.events.reduce(function(p, c){
      if(c.events.length > p) {
        return c.events.length;
      } else {
        return p;
      }
    }, 0);
    this.current = moment().date(1);
    this.draw();
    var current = document.querySelector('.today');
    if (current) {
      var self = this;
      window.setTimeout(function() {
        self.openDay(current);
      }, 500);
    }
  }

  Calendar.prototype.draw = function() {
    //Create Header
    this.drawHeader();
    //Draw Month
    this.drawMonth();
    // Draw Legend
    //this.drawLegend();
  }

  Calendar.prototype.drawHeader = function() {
    var self = this;
    if (!this.header) {
      //Create the header elements
      this.header = createElement('div', 'header');
      this.header.className = 'header';

      //this.title = createElement('h1');
      this.title = {
        month: createElement('div', 'month', this.current.format('MMMM')),
        year: createElement('div', 'year', this.current.format('YYYY'))
      }

      var right = createElement('div', 'right');
      right.addEventListener('click', function() {
        self.nextMonth();
      });

      var left = createElement('div', 'left');
      left.addEventListener('click', function() {
        self.prevMonth();
      });

      var ringLeft = createElement('div', 'ring-left');
      var ringRight = createElement('div', 'ring-right');
      //Append the Elements
      //this.header.appendChild(this.title);
      this.header.appendChild(this.title.month);
      this.header.appendChild(this.title.year);
      this.header.appendChild(ringLeft);
      this.header.appendChild(ringRight);

      this.header.appendChild(right);
      this.header.appendChild(left);
      this.el.appendChild(this.header);
      this.drawWeekDays();
    }

    //this.title.innerHTML = this.current.format('MMMM YYYY');
    this.title.month.innerHTML = this.current.format('MMMM');
    this.title.year.innerHTML = this.current.format('YYYY');
  }

  Calendar.prototype.drawMonth = function() {
    var self = this;

    this.events.forEach(function(event) {
      //ev.date = self.current.clone().date(Math.random() * (29 - 1) + 1);
      event.date = moment(event.date);
    });

    if (this.month) {
      this.oldMonth = this.month;
      this.oldMonth.className = 'month out ' + (self.next ? 'next' : 'prev');
      this.oldMonth.addEventListener('webkitAnimationEnd', function() {
        self.oldMonth.parentNode.removeChild(self.oldMonth);
        self.month = createElement('div', 'month');
        self.backFill();
        self.currentMonth();
        self.fowardFill();
        self.el.appendChild(self.month);
        window.setTimeout(function() {
          self.month.className = 'month in ' + (self.next ? 'next' : 'prev');
        }, 16);
      });
    } else {
      this.month = createElement('div', 'month');
      this.el.appendChild(this.month);
      this.backFill();
      this.currentMonth();
      this.fowardFill();
      this.month.className = 'month new';
    }
  }

  Calendar.prototype.backFill = function() {
    var clone = this.current.clone();
    var dayOfWeek = clone.day();

    if (!dayOfWeek) {
      return;
    }

    clone.subtract('days', dayOfWeek + 1);

    for (var i = dayOfWeek; i > 0; i--) {
      this.drawDay(clone.add('days', 1));
    }
  }

  Calendar.prototype.fowardFill = function() {
    var clone = this.current.clone().add('months', 1).subtract('days', 1);
    var dayOfWeek = clone.day();

    if (dayOfWeek === 6) {
      return;
    }

    for (var i = dayOfWeek; i < 6; i++) {
      this.drawDay(clone.add('days', 1));
    }
  }

  Calendar.prototype.currentMonth = function() {
    var clone = this.current.clone();

    while (clone.month() === this.current.month()) {
      this.drawDay(clone);
      clone.add('days', 1);
    }
  }

  Calendar.prototype.getWeek = function(day) {
    if (!this.week || day.day() === 0) {
      this.week = createElement('div', 'week');
      this.month.appendChild(this.week);
    }
  }

  Calendar.prototype.drawDay = function(day) {
    var self = this;
    this.getWeek(day);

    var todayEvents = this.events.filter(function(event){
      return event.date.isSame(day, 'day');
    })[0];

    //Outer Day
    var outer = createElement('div', this.getDayClass(day));
    var circle = createElement('span', 'circle');
    if(todayEvents) {
      outer.addEventListener('click', function() {
        self.openDay(this);
      });
      // Circle
      var size = (1 / this.maxEvents) * todayEvents.events.length;
      circle.style.webkitTransform = 'scale(' + size + ')';
      circle.style.MozProperty = 'scale(' + size + ')';
      circle.style.transform = 'scale(' + size + ')';      
    } else {
      circle.style.webkitTransform = 'scale(0, 0)';
      circle.style.MozProperty = 'scale(0, 0)';
      circle.style.transform = 'scale(0, 0)';      
      outer.style.cursor = 'default';
    }

    //Day Name
    var name = createElement('div', 'day-name', day.format('ddd'));

    //Day Number
    var number = createElement('div', 'day-number', day.format('DD'));

    //Events
    var events = createElement('div', 'day-events');
    this.drawEvents(day, events);

    //outer.appendChild(name);
    outer.appendChild(circle);
    outer.appendChild(number);
    //outer.appendChild(events);
    this.week.appendChild(outer);
  }

  Calendar.prototype.drawEvents = function(day, element) {
    if (day.month() === this.current.month()) {
      var todaysEvents = this.events.reduce(function(memo, ev) {
        if (ev.date.isSame(day, 'day')) {
          memo.push(ev);
        }
        return memo;
      }, []);

      todaysEvents.forEach(function(ev) {
        var evSpan = createElement('span', ev.color);
        element.appendChild(evSpan);
      });
    }
  }

  Calendar.prototype.getDayClass = function(day) {
    classes = ['day'];
    if (day.month() !== this.current.month()) {
      classes.push('other');
    } else if (today.isSame(day, 'day')) {
      classes.push('today');
    }
    return classes.join(' ');
  }

  Calendar.prototype.openDay = function(el) {
    var details, arrow;
    var dayNumber = +el.querySelectorAll('.day-number')[0].innerText || +el.querySelectorAll('.day-number')[0].textContent;
    var day = this.current.clone().date(dayNumber);

    var currentOpened = document.querySelector('.details');

    //Check to see if there is an open detais box on the current row
    if (currentOpened && currentOpened.parentNode === el.parentNode) {
      details = currentOpened;
      arrow = document.querySelector('.arrow');
    } else {
      //Close the open events on differnt week row
      //currentOpened && currentOpened.parentNode.removeChild(currentOpened);
      if (currentOpened) {
        currentOpened.addEventListener('webkitAnimationEnd', function() {
          currentOpened.parentNode.removeChild(currentOpened);
        });
        currentOpened.addEventListener('oanimationend', function() {
          currentOpened.parentNode.removeChild(currentOpened);
        });
        currentOpened.addEventListener('msAnimationEnd', function() {
          currentOpened.parentNode.removeChild(currentOpened);
        });
        currentOpened.addEventListener('animationend', function() {
          currentOpened.parentNode.removeChild(currentOpened);
        });
        currentOpened.className = 'details out';
      }

      //Create the Details Container
      details = createElement('div', 'details in');

      //Create the arrow
      var arrow = createElement('div', 'arrow');

      //Create the event wrapper
      details.appendChild(arrow);
      el.parentNode.appendChild(details);
    }

    var todaysEvents = this.events.filter(function(event){
      return event.date.isSame(day, 'day');
    });

    console.log('m: ', todaysEvents)
    this.renderEvents(todaysEvents, details);

    arrow.style.left = el.offsetLeft - el.parentNode.offsetLeft + (el.offsetWidth / 2) + 'px';
  }

  Calendar.prototype.renderEvents = function(events, ele) {
    //Remove any events in the current details element
    var currentWrapper = ele.querySelector('.events');
    var wrapper = createElement('div', 'events in' + (currentWrapper ? ' new' : ''));

    if(events.length < 1) {
      return;
    }
    console.log("events: ", events);
    events[0].events.forEach(function(ev) {
      console.log("evv: ", ev);
      var div = createElement('div', 'event');
      var square = createElement('div', 'event-category ' + ev.color);
      var span = createElement('span', '', ev.name);

      div.appendChild(square);
      div.appendChild(span);
      wrapper.appendChild(div);
    });

    if (!events.length) {
      var div = createElement('div', 'event empty');
      var span = createElement('span', '', 'No Events');

      div.appendChild(span);
      wrapper.appendChild(div);
    }

    if (currentWrapper) {
      currentWrapper.className = 'events out';
      currentWrapper.addEventListener('webkitAnimationEnd', function() {
        currentWrapper.parentNode.removeChild(currentWrapper);
        ele.appendChild(wrapper);
      });
      currentWrapper.addEventListener('oanimationend', function() {
        currentWrapper.parentNode.removeChild(currentWrapper);
        ele.appendChild(wrapper);
      });
      currentWrapper.addEventListener('msAnimationEnd', function() {
        currentWrapper.parentNode.removeChild(currentWrapper);
        ele.appendChild(wrapper);
      });
      currentWrapper.addEventListener('animationend', function() {
        currentWrapper.parentNode.removeChild(currentWrapper);
        ele.appendChild(wrapper);
      });
    } else {
      ele.appendChild(wrapper);
    }
  }

  Calendar.prototype.drawWeekDays = function(el) {
    var self = this;
    this.weekDays = createElement('div', 'week-days')
    var weekdays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
    weekdays.forEach(function(weekday){
      var day = createElement('span', 'day', weekday);
      self.weekDays.appendChild(day);
    })
    this.el.appendChild(this.weekDays);
  }

  Calendar.prototype.drawLegend = function() {
    var legend = createElement('div', 'legend');
    var calendars = this.events.map(function(e) {
      return e.calendar + '|' + e.color;
    }).reduce(function(memo, e) {
      if (memo.indexOf(e) === -1) {
        memo.push(e);
      }
      return memo;
    }, []).forEach(function(e) {
      var parts = e.split('|');
      var entry = createElement('span', 'entry ' + parts[1], parts[0]);
      legend.appendChild(entry);
    });
    this.el.appendChild(legend);
  }

  Calendar.prototype.nextMonth = function() {
    this.current.add('months', 1);
    this.next = true;
    this.draw();
  }

  Calendar.prototype.prevMonth = function() {
    this.current.subtract('months', 1);
    this.next = false;
    this.draw();
  }

  window.Calendar = Calendar;

  function createElement(tagName, className, innerText) {
    var element = document.createElement(tagName);
    if (className) {
      element.className = className;
    }
    if (innerText) {
      element.innderText = element.textContent = innerText;
    }
    return element;
  }''
}();

var app = angular.module('myApp', []);
app.controller('AppCtrl', function($scope){
  //alert("pepe")
});
app.directive('calendar', [function(){
  return {
    restrict: 'EA',
    scope: {
      date: '=',
      events: '='
    },
    link: function(scope, element, attributes) {
      var data = [{
        date: new Date(2017, 0, 1),
        events: [{
          name: 'smokeloader',
          type: 'bot',
          color: 'orange'
        }]
      }, {
        date: new Date(2017, 0, 2),
        events: [{
          name: 'zeus',
          type: 'bot',
          color: 'blue'
        }]
      }, {
        date: new Date(2017, 0, 3),
        events: [{
          name: 'ponyloader',
          type: 'bot',
          color: 'yellow'
        }, {
          name: 'aldibot',
          type: 'bot',
          color: 'yellow'
        }, {
          name: 'dirtjumper',
          type: 'malware',
          color: 'yellow'
        }]
      }, {
        date: new Date(2017, 0, 4),
        events: [{
          name: 'andromeda',
          type: 'bot',
          color: 'green'
        }]
      }, {
        date: new Date(2017, 0, 5),
        events: [{
          name: 'conficker',
          type: 'bot',
          color: 'orange'
        }, {
          name: 'umbraloader',
          type: 'bot',
          color: 'orange'
        }]
      }, {
        date: new Date(2017, 0, 17),
        events: [{
          name: 'aldibot',
          type: 'bot',
          color: 'pink'
        }]
      }, {
        date: new Date(2017, 0, 2),
        events: [{
          name: 'zeus',
          type: 'bot',
          color: 'blue'
        }]
      }, {
        date: new Date(2017, 0, 18),
        events: [{
          name: 'ponyloader',
          type: 'bot',
          color: 'yellow'
        }, {
          name: 'aldibot',
          type: 'bot',
          color: 'yellow'
        }, {
          name: 'dirtjumper',
          type: 'malware',
          color: 'yellow'
        }]
      }, , {
        date: new Date(2017, 0, 19),
        events: [{
          name: 'zeus',
          type: 'bot',
          color: 'blue'
        }]
      }, {
        date: new Date(2017, 0, 19),
        events: [{
          name: 'ponyloader',
          type: 'bot',
          color: 'yellow'
        }]
      }]
      var calendar = new Calendar('#calendar', data);
    }
  }
}]);