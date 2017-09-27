document.addEventListener("DOMContentLoaded", function (event) {
Barba.Pjax.start();
$(".page__content").mCustomScrollbar({
	axis:"y",
}); 
$(".content").mCustomScrollbar({
	axis:"x",
	autoHideScrollbar: true,
}); 
var lastClicked;

Barba.Dispatcher.on('linkClicked', function(el){
	lastClicked = el;

});

var ExpandTransition = Barba.BaseTransition.extend({
  start: function() {
    Promise
      .all([this.newContainerLoading, this.zoom()])
      .then(this.showNewPage.bind(this));
  },

  zoom: function() {
    var deferred = Barba.Utils.deferred();

    let tl = new TimelineMax();
    let left = lastClicked.getBoundingClientRect().left;
    let cloned = lastClicked.cloneNode(true);

    let nextAll = $(lastClicked).nextAll();
    let prevAll = $(lastClicked).prevAll();

    cloned.classList.add('cloned');
    this.oldContainer.appendChild(cloned);
    tl.set(cloned,{x:left});
    let screenWidth = $(window).width();
    let bg = $(cloned).find('.item__bg');

    tl.to(cloned, 1, {x:0, width: screenWidth, onComplete: function() {
    	deferred.resolve();
    }}, 0);
    if (prevAll.length) {
    	let prevAllLeft = prevAll[0].getBoundingClientRect().left;
    tl.staggerTo(prevAll,1.2,{
    	cycle: {
    		x: function(n) {
    			if (n<3) {
    				return -(screenWidth/3 + prevAllLeft)
    			}
    		}
    	}
    	
    	    },0,0);
    }
    if (nextAll.length) {
    let nextAllLeft = nextAll[0].getBoundingClientRect().left;
    console.log(screenWidth/3)
    tl.staggerTo(nextAll,1.2,{

    	cycle:{
    		x: function(n) {
    			if (n<3) {
    				return (screenWidth/3);
    			}
    			
    		}
    	}
    	},0,0);
    
    }
    tl.to(bg, 1, {x:0}, 0);
    
    return deferred.promise;
  },

  showNewPage: function() {
  	$(".page__content").mCustomScrollbar({
	axis:"y",
}); 
    this.done();
  }
});

var BackTransition = Barba.BaseTransition.extend({
  start: function() {
    Promise
      .all([this.newContainerLoading, this.zoom()])
      .then(this.showNewPage.bind(this));
  },

  zoom: function() {
    var deferred = Barba.Utils.deferred();

    let tl = new TimelineMax();
    let left = lastClicked.getBoundingClientRect().left;
    let cloned = lastClicked.cloneNode(true);
    

    let prev = $(lastClicked).prev();
    console.log(prev);

    cloned.classList.add('cloned');
    cloned.innerHTML = 'Going back...';
    this.oldContainer.appendChild(cloned);
    tl.set(cloned,{x:left});
    let screenWidth = $(window).width();

    tl.to(cloned, 1, {x:0, width: screenWidth, onComplete: function() {
    	deferred.resolve();

    }}, 0);

    tl.to(prev,1,{
    	x: -(200)
    	    },0);
    $(lastClicked).fadeOut();
    
    return deferred.promise;
  },

  showNewPage: function() {
    this.done();
    	$(".content").mCustomScrollbar({
			axis:"x"
		}); 
  
  }
});

Barba.Pjax.getTransition = function() {
  var transitionObj = ExpandTransition;

  if (Barba.HistoryManager.prevStatus().namespace === 'Single'){
  	transitionObj = BackTransition;
  }
  $(".barba-container").mCustomScrollbar({
			axis:"x"
		}); 
  return transitionObj;
};

});
