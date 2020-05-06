"use strict";

/* Seleccionamos modelo */
const Job = use("App/Models/Job");
class JobController {
  /* Solo acceso a view, temporalmente cuando alguien visita se crea un job */
  async home({ view }) {
    const job = new Job();
    job.title = "Titulo";
    job.link = "Link Trabajo";
    job.description = "Descripcion del Trabajo";

    /* fetch a job */
    const jobs = await Job.all();

    // Solo crear una tarea cuando se inicializa la base de datos
    if (!jobs.rows.length) {
      await job.save();
    }

    /* devolvemos el job en formato json a la vista index */
    return view.render("index", { jobs: jobs.toJSON() });
  }

  async userIndex({ view, auth }) {
    // Fetch all user's jobs
    const jobs = await auth.user.jobs().fetch();
    console.log(jobs);

    return view.render("jobs", { jobs: jobs.toJSON() });
  }

  async create({ request, response, session, auth }) {
    const job = request.all();

    const posted = await auth.user.jobs().create({
      title: job.title,
      link: job.link,
      description: job.description,
    });

    session.flash({ message: "Tu Trabajo ha sido creado!" });
    return response.redirect("back");
  }

  async delete({ response, session, params }) {
    const job = await Job.find(params.id);

    await job.delete();
    session.flash({ message: "Tu trabajo ha sido elimnado" });
    return response.redirect("back");
  }

  async edit({ params, view }) {
    const job = await Job.find(params.id);
    return view.render("edit", { job: job });
  }

  async update({ response, request, session, params }) {
    const job = await Job.find(params.id);

    job.title = request.all().title;
    job.link = request.all().link;
    job.description = request.all().description;

    await job.save();

    session.flash({ message: "Tu trabajo ha sido actualizado. " });
    return response.redirect("/post-a-job");
  }
}

module.exports = JobController;
