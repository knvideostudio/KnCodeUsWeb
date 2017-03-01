//ui.calendar --> for caledar control
//ui.bootstrap  --> for bootstrap angualr UI modal popup

var app = angular.module('myapp', ['ui.calendar', 'ui.bootstrap']);
app.controller('CalenderController', ['$scope', '$http', 'uiCalendarConfig', '$uibModal', function ($scope, $http, uiCalendarConfig, $uibModal) {

    $scope.SelectedEvent = null;

    var isFirstTime = true;

    $scope.CalendarEvents = [];
    $scope.eventSources = [$scope.CalendarEvents];
    $scope.NewEvent = {};

    function getDate(datetime) {
        if (datetime != null) {
            var mili = datetime.replace(/\/Date\((-?\d+)\)\//, '$1');
            return new Date(parseInt(mili));
        }
        else {
            return "";
        }
    }

    function clearCalendar() {
        if (uiCalendarConfig.calendars.myCalendar != null) {
            uiCalendarConfig.calendars.myCalendar.fullCalendar('removeEvents');
            uiCalendarConfig.calendars.myCalendar.fullCalendar('unselect');
        }
    }

    function populate() {
        clearCalendar();

        $http.get('/calendar/GetAppointments', {
            cache: false,
            params: {}
        }).then(function (data) {
            $scope.CalendarEvents.slice(0, $scope.CalendarEvents.length);
            angular.forEach(data.data, function (value) {
                $scope.CalendarEvents.push({
                    id: value.CalendarID,
                    title: value.CalendarTitle,
                    description: value.CalendarDesc,
                    start: new Date(parseInt(value.StartDay.substr(6))),
                    end: new Date(parseInt(value.EndDay.substr(6))),
                    allDay: value.isFullDay,
                    stick: true
                });
            });
        });
    }

    populate();

    $scope.uiConfig = {
        calendar: {
            height: 450,
            editable: true,
            displayEventTime: true,
            header: {
                left: 'month,agendaWeek,agendaDay',
                center: 'title',
                right: 'today prev,next'
            },
            timeFormat: {
                month: ' ', 
                agenda: 'h:mm t'
            },
            selectable: true,
            selectHelper: true,
            select: function (start, end) {
                var fromDate = moment(start).format('YYYY/MM/DD LT');
                var endDate = moment(end).format('YYYY/MM/DD LT');
                $scope.NewEvent = {
                    CalendarID: 0,
                    StartDay: fromDate,
                    EndDay: endDate,
                    isFullDay: false,
                    CalendarTitle: '',
                    CalendarDesc: ''
                }

                $scope.ShowModal();
            },
            eventClick: function (event) {
                $scope.SelectedEvent = event;
                var fromDate = moment(event.start).format('YYYY/MM/DD LT');
                var endDate = moment(event.end).format('YYYY/MM/DD LT');
                $scope.NewEvent = {
                    CalendarID: event.id,
                    StartDay: fromDate,
                    EndDay: endDate,
                    isFullDay: false,
                    CalendarTitle: event.title,
                    CalendarDesc: event.description
                }

                $scope.ShowModal();
            },
            eventAfterAllRender: function () {
                if ($scope.CalendarEvents.length > 0 && isFirstTime) {
                    uiCalendarConfig.calendars.myCalendar.fullCalendar('gotoDate', $scope.CalendarEvents[0].start);
                    isFirstTime = false;
                }
            }
        }
    };

    $scope.ShowModal = function () {
        $scope.option = {
            templateUrl: 'popUpModalPage.html',
            controller: 'modalController',
            backdrop: 'static',
            resolve: {
                NewEvent: function () {
                    return $scope.NewEvent;
                }
            }
        };

        var modal = $uibModal.open($scope.option);
        modal.result.then(function (data) {
            $scope.NewEvent = data.event;
            switch (data.operation) {
                case 'Save':       
                    $http({
                        method: 'POST',
                        url: '/calendar/CalendarSaveAppointment',
                        data: $scope.NewEvent
                    }).then(function (response) {
                        if (response.data.status) {
                            populate();
                        }
                    })
                    break;
                case 'Delete':        
                    $http({
                        method: 'POST',
                        url: '/calendar/CalendarDeleteAppointment',
                        data: { 'eventID': $scope.NewEvent.CalendarID }
                    }).then(function (response) {
                        if (response.data.status) {
                            populate();
                        }
                    })
                    break;
                default:
                    break;
            }
        }, function () {
            console.log('Modal dialog closed');
        })
    }
}])

// This is a modula POP-UP window
app.controller('modalController', ['$scope', '$uibModalInstance', 'NewEvent', function ($scope, $uibModalInstance, NewEvent) {
    $scope.NewEvent = NewEvent;
    $scope.Message = "";
    $scope.ok = function () {
        if ($scope.NewEvent.CalendarTitle.trim() != "") {
            $uibModalInstance.close({ event: $scope.NewEvent, operation: 'Save' });
        }
        else {
            $scope.Message = "Event title required!";
        }
    }
    $scope.delete = function () {
        $uibModalInstance.close({ event: $scope.NewEvent, operation: 'Delete' });
    }
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    }
}])