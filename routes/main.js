module.exports = function(app) {

  app.get("/", function(req, res, next) {
    res.render("home", {name: "Hello i'm jonathan"});
  });

  app.get("/about", function(req, res, next) {
    res.render("about");
  });


}
