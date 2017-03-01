using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

// add the model
using KnCodeUsWeb.Models;


namespace KnCodeUsWeb.Controllers
{
    public class CalendarController : Controller
    {
        // GET: Calendar

        [Authorize]
        public ActionResult Index()
        {
            return View();
        }

        [Authorize]
        public JsonResult GetAppointments()
        {
            // Return all the records from the Calendar in JSON format
            using (KnEntitiesDB dc = new KnEntitiesDB())
            {
                var v = dc.CalendarEvents.OrderBy(a => a.StartDay).ToList();
                return new JsonResult { Data = v, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        // Save the appontment tothe  database
        [HttpPost]
        [Authorize]
        public JsonResult CalendarSaveAppointment(CalendarEvent evt)
        {
            bool status = false;

            using (KnEntitiesDB dc = new KnEntitiesDB())
            {
                if (evt.EndDay != null && evt.StartDay.TimeOfDay == new TimeSpan(0, 0, 0) &&
                    evt.EndDay.TimeOfDay == new TimeSpan(0, 0, 0))
                {
                    evt.isFullDay = true;
                }
                else
                {
                    evt.isFullDay = false;
                }

                if (evt.CalendarID > 0)
                {
                    var v = dc.CalendarEvents.Where(a => a.CalendarID.Equals(evt.CalendarID)).FirstOrDefault();
                    if (v != null)
                    {
                        v.CalendarTitle = evt.CalendarTitle;
                        v.CalendarDesc = evt.CalendarDesc;
                        v.StartDay = evt.StartDay;
                        v.EndDay = evt.EndDay;
                        v.isFullDay = evt.isFullDay;
                    }
                }
                else
                {
                    dc.CalendarEvents.Add(evt);
                }

                dc.SaveChanges();
                status = true;
            }
            return new JsonResult { Data = new { status = status } };
        }

        // Delete the appointment from the calendar
        [HttpPost]
        [Authorize]
        public JsonResult CalendarDeleteAppointment(int eventID)
        {
            bool status = false;
            using (KnEntitiesDB dc = new KnEntitiesDB())
            {
                var v = dc.CalendarEvents.Where(a => a.CalendarID.Equals(eventID)).FirstOrDefault();
                if (v != null)
                {
                    dc.CalendarEvents.Remove(v);
                    dc.SaveChanges();
                    status = true;
                }
            }

            return new JsonResult { Data = new { status = status } };
        }

    }
}