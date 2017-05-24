var contact = document.getElementById('contact-me');
var projectsContainer = document.getElementById('projects-container');

var copyEmail = document.getElementById('copy-email');

copyEmail.onclick = function () {
    contact.innerHTML = '<span class=\'fade-in\'>Copied</span>';
};

var clipboard = new Clipboard('#copy-email');

document.getElementById('reveal').onclick = function () {
    document.body.id = 'show-projects';
    return false; // only necessary for links, so this is somewhat unnecessary
};//TODO

document.getElementById('close-curtains').onclick = function () {
    document.body.id = '';
}

function buildHeader() {
    var head = new Headers();
    head.append('pragma', 'no-cache');
    head.append('cache-control', 'no-cache');

    var init = {
        method: 'GET',
        headers: head,
    };

    return init;
}

function JsonPuller() {
    this.jsonPath = 'json/';
    this.files = ['projects', 'opensource', 'hackathons', 'uni-projects', 'code-practice', 'gaming'];
}

JsonPuller.prototype.getJson = function (index) {
    return fetch(this.jsonPath + this.files[index] + '.json', buildHeader())
        .then(function (res) {
            return res.json();
        });
}

function createElement(el, text, classes) {
    var node = document.createElement(el);

    if (text)
        node.appendChild(document.createTextNode(text));

    for (var i = 0; i < classes.length; ++i) {
        node.classList.add(classes[i]);
    }

    return node;
}

function createLink(text, href, classes, newWindow) {
    var link = createElement('a', text, classes);
    link.href = href;

    if (newWindow) {
        link.target = "_blank";
        link.rel = "noopener";
    }

    return link;
}

function appendChildren(parent, children) {
    for (var i = 0; i < children.length; ++i) {
        parent.appendChild(children[i]);
    }
}

function typeOf(value) {
    var s = typeof value;

    if (s === 'object') {
        if (value) {
            if (value instanceof Array) {
                s = 'array';
            }
        } else {
            s = 'null';
        }
    }

    return s;
}

var jp = new JsonPuller();
var projectIDs = ['projectz', 'opensource', 'hackathons', 'uni-projects', 'code-practice', 'gaming'];
var secTitles = ['Projects', 'Contributions', 'Hackathon Projects', 'Uni Projects', 'Code', 'Gaming'];
var jsonKeys = ['projects', 'contributions', 'hackathons', 'projects', 'accounts', 'achievements'];

for (var z = 0; z < projectIDs.length; ++z) {
    // Closures!!
    document.getElementById(projectIDs[z]).onclick = function (z) {
        return function () { // TODO: Implementing caching.
            jp.getJson(z).then(function (r) {
                projectsContainer.innerHTML = '';

                var projectsBG = document.getElementById('projects');

                document.getElementById('grand-title').innerHTML = secTitles[z];
                var items = r[jsonKeys[z]];

                // TODO: Ugh, the order gets messed up, but this will do for now.
                for (var i = 0; i < 2; ++i) {
                    var colNode = createElement('div', null, ['project-col']);

                    for (var j = i; j < items.length; j += 2) {
                        var title = items[j]["name"];
                        var desc = items[j]["desc"];
                        var src = items[j]["src"];
                        var demo = items[j]["demo"];

                        if (title && desc) {
                            var node = createElement('li', null, ['project', 'fade-in']);
                            var titleNode = createElement('h2', title, ['project-title', 'flash']);
                            var descNode = createElement('p', desc, ['project-desc']);
                            var linksNode = createElement('span', null, ['projects-links']);

                            var srcNode;

                            if (src)
                                linksNode.appendChild(createLink("src", src, ['project-permalink'], true));

                            if (src && demo)
                                linksNode.innerHTML += "&nbsp;";

                            if (demo) {
                                if (typeOf(demo) === 'array') {
                                    for (var k = 0; k < demo.length; ++k) {
                                        linksNode.appendChild(
                                            createLink("demo", demo[k], ['project-permalink'], true)
                                        )

                                        linksNode.innerHTML += (k === demo.length - 1) ? "" : "&nbsp";
                                    }
                                } else {
                                    linksNode.appendChild(createLink("demo", demo, ['project-permalink'], true));
                                }
                            }

                            appendChildren(node, [titleNode, descNode, linksNode]);
                            colNode.appendChild(node);
                        }
                    }

                    projectsContainer.appendChild(colNode);
                }
            });
        }
    }(z);
}

(function () {
    window.addEventListner('load', function () {
        (function (i, s, o, g, r, a, m) {
            i['GoogleAnalyticsObject'] = r; i[r] = i[r] || function () {
                (i[r].q = i[r].q || []).push(arguments)
            }, i[r].l = 1 * new Date(); a = s.createElement(o),
                m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m)
        })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

        ga('create', 'UA-91759456-1', 'auto');
        ga('send', 'pageview');
    });
});