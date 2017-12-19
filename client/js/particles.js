particlesJS("particles-js", {
    "particles": {
    "number": {
        "value": 99,
            "density": {
            "enable": true,
                "value_area": 868.0624057955
        }
    },
    "color": {
        "value": "#ffffff"
    },
    "shape": {
        "type": "circle",
            "stroke": {
            "width": 0,
                "color": "#000000"
        },
        "polygon": {
            "nb_sides": 5
        },
        "image": {
            "src": "img/github.svg",
                "width": 100,
                "height": 100
        }
    },
    "opacity": {
        "value": 0.4734885849793636,
            "random": false,
            "anim": {
            "enable": false,
                "speed": 1,
                "opacity_min": 0.1,
                "sync": false
        }
    },
    "size": {
        "value": 3,
            "random": true,
            "anim": {
            "enable": false,
                "speed": 40,
                "size_min": 0.1,
                "sync": false
        }
    },
    "line_linked": {
        "enable": true,
            "distance": 150,
            "color": "#ffffff",
            "opacity": 0.4,
            "width": 1
    },
    "move": {
        "enable": true,
            "speed": 6,
            "direction": "none",
            "random": false,
            "straight": false,
            "out_mode": "out",
            "bounce": false,
            "attract": {
            "enable": false,
                "rotateX": 600,
                "rotateY": 1200
        }
    }
},
    "interactivity": {
    "detect_on": "canvas",
        "events": {
        "onhover": {
            "enable": true,
                "mode": "repulse"
        },
        "onclick": {
            "enable": true,
                "mode": "push"
        },
        "resize": true
    },
    "modes": {
        "grab": {
            "distance": 400,
                "line_linked": {
                "opacity": 1
            }
        },
        "bubble": {
            "distance": 400,
                "size": 40,
                "duration": 2,
                "opacity": 8,
                "speed": 3
        },
        "repulse": {
            "distance": 200,
                "duration": 0.4
        },
        "push": {
            "particles_nb": 4
        },
        "remove": {
            "particles_nb": 2
        }
    }
},
    "retina_detect": true
});

$(document).ready(function() {

    paddingTop();
    $(window).on('resize', paddingTop)
});

function paddingTop() {

    let height = $('#particles-js').css("height");
    console.log(parseInt(height)+50)
    $('#introduction').css("padding-top", parseInt(height)+50)
}