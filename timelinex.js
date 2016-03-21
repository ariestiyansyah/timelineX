TasksCollection = new Mongo.Collection("tasks");
LinksCollection = new Mongo.Collection("links");

Router.configure({
  layoutTemplate: 'main'
});

Router.route('/masuk', {
  name: 'masuk',
  Template: 'masuk'
});

Router.route('/tentang', {
  name: 'tentang',
  template: 'tentang'
});

Router.route('/', {
  name: 'beranda',
  template: 'beranda',
  data: function() {},
  onBeforeAction: function(){
    var currentUser = Meteor.userId();
    if(createUser){
      this.next();
    } else {
      this.redirect('/masuk');
    }
  },
  onAfterAction: function(){
    var currentUser = Meteor.userId();
    if(currentUser){
      setTimeout(function()
    {
      var hariStyle = function(date){
        var dateToStr = gantt.date.date_to_str("%D");
        if (dateToStr(date) == "Sun" || dateToStr(date) == "Sat") {
          return "weekend";
        }
        return "";
      };
      gantt.config.start_date = new Date(2016,2,1);
      gantt.config.end_date = new Date(2016,9,1);
      gantt.config.scale_height = 84;
      gantt.config.scale_unit = "month";
      gantt.config.date_scale = "%F, %Y";
      gantt.config.grid_width = 300;
      gantt.config.min_column_width = 20;
      gantt.config.subscales = [
        {unit: "week", step:1, date:"Week %W"},
        {unit: "day", step:1, date:"%d", css:hariStyle}
      ];
      gantt.config.columns = [
        {name: "text", label: "Tasks", width: '*', tree: true },
        {name: "add", label:""}. width: 44 }
      ];
      gantt.init("gantt_here");
      gantt.meteor({tasks: TasksCollection, links: LinksCollection});
    }, 0);
  }
},
});

if (Meteor.isServer) {
  Meteor.startup(function() {
    if (Meteor.user.find().count() == 0) {
      Accounts.createUser({
        email: '',
        password: ''
      });
    }
  });

  Meteor.publish('tasks', function() {
    return TasksCollection.find();
  });
  Meteor.publish('links', function(){
    return LinksCollection.find();
  });
}

if (Meteor.isClient) {
  Meteor.subscribe('tasks');
  Meteor.subscribe('links');

  Template.navigation.events({
    'click .logout': function(event){
      event.preventDefault();
      Meteor.logout();
    }
  });

  Template.masuk.events({
    'submit form': function(event){
      event.preventDefault();
      var email = $('[name=email]').val();
      var password = $('[name=password]').val();
      Meteor.loginWithPassword(email, password, function(error) {
        if(error) {
          console.log(error.reason);
        } else {
          Router.go("/");
        }
      });
    }
  });

  Template.navigation.helpers({
    isActiveRoute:function(page){
      if (page == Router.current().route.getName()) {
        return 'active';
      }
    }
  });

  Template.beranda.events({
    'focus #date_start': function(e, template){
      var f = Template.instance().$('#date_start');
    }
  })
}
