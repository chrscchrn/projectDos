(() => {
    //get article number saved in local storage
    let articleNum = getUrl();
    let article = JSON.parse(localStorage.getItem(`article${articleNum.num}`));
    console.log(article);
    $("#loadTitle").text(article.title);
    $("#loadPublisher").text(article.source.name); //
    $("#loadDate").text(article.publishedAt); //
    $("#loadAuthor").text(article.author); //
    $("#loadContent").text(article.content); //
    $("#loadURL").attr("href", article.url);
    if (article.noteTitle) {
        $("#noteTitle").text(article.noteTitle);
    }
    if (article.body) {
        $("#noteBody").text(article.body);
    }

    function getUrl() {
        var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    }

    var $noteTitle = $("#noteTitle");
    var $body = $("#noteBody");
    var $url = article.url;
    var $title = article.title;
    var $source = article.source.name;
    var $publishedAt = article.publishedAt;
    var $author = article.author;
    var $content = article.content;
    var $saveButton = $("#save");
    var $deleteButton = $("#delete");

    $($saveButton).on("click", save);
    $($deleteButton).on("click", deleteButtonPressed);

    //checking if the current note has been created
    let isCreated; //variable scope FTW
    var noteCheck = {
        noteTitle: $noteTitle.val().trim(),
        body: $body.val().trim(),
        url: $url,
        title: $title
    };

    //to edit needs to be in an if statement and find in sql
    $.get("/api/work/update", noteCheck)
        .then(res => {
            console.log(res);
            (res != null) ? isCreated = true : isCreated = false;
        })

    function save(event) {
        event.preventDefault();
        console.log(isCreated);
        if (isCreated == false) {
            var note = {
                noteTitle: $noteTitle.val().trim(),
                body: $body.val().trim(),
                url: $url,
                title: $title,
                source: $source,
                publishedAt: $publishedAt,
                author: $author,
                content: $content
            };
            $.post("/api/work", note);
        } else {
            var noteUpdated = {
                noteTitle: $noteTitle.val().trim(),
                body: $body.val().trim(),
                url: $url,
                title: $title
            };
            $.get("/api/work/update", noteUpdated)
                .then(res => {
                    //if it is found
                    if (res) {
                        console.log(res, "good");
                        var note = {
                            noteTitle: $noteTitle.val().trim(),
                            body: $body.val().trim(),
                            url: $url,
                            title: $title
                        };
                        $.ajax({
                            url: '/api/work/update',
                            type: 'PUT',
                            data: note,
                            success: () => { }
                        });
                    }
                })
        }
        isCreated = true;
    }

    function deleteButtonPressed() {
        console.log($url)
        let urlObj = { url: $url }
        $.ajax({
            method: "DELETE",
            url: "/api/work/",
            data: urlObj

        }).then(res => {
            localStorage.clear();
            console.log(res)
            // Window.location.reload();
            // res.redirect("/notes");
        })
            .catch(err => console.log(err));
    }
})()
