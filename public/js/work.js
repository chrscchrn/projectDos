(() => {
    //get article number saved in local storage
    let articleNum = getUrl();
    let article = JSON.parse(localStorage.getItem(`article${articleNum.num}`)); 
    // console.log(article.title, article.author, article.content, article.publishedAt, article.source.name, article.url, );
    $("#loadTitle").text(article.title);
    $("#loadPublisher").text(article.source.name);
    $("#loadDate").text(article.publishedAt);
    $("#loadAuthor").text(article.author);
    $("#loadContent").text(article.content);
    $("#loadURL").attr("href", article.url);

    function getUrl() {
        var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for(var i = 0; i < hashes.length; i++)
        {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    }

    var $title = $("#noteTitle");
    var $body = $("#noteBody");
    var $url = article.url;
    var $article = article.title;
    var $saveButton = $("#save")
    
    //checking if the current note has been created
    let isCreated; //variable scope FTW
    var noteCheck = {
        title: $title.val().trim(),
        body: $body.val().trim(),
        url: $url,
        article: $article
    };

    //to edit needs to be in an if statement and find in sql
    $.get("/api/work/update", noteCheck)
    .then(res => {
        console.log(res);
        (res != null) ? isCreated = true: isCreated = false;
    })
    
    //save the article and notes
    $($saveButton).on("click", save);

    function save(event) {
        event.preventDefault();
        console.log(isCreated);
        if (isCreated == false) {
            var note = {
                title: $title.val().trim(),
                body: $body.val().trim(),
                url: $url,
                article: $article
            };
            $.post("/api/work", note);
        } else {
            var noteUpdated = {
                title: $title.val().trim(),
                body: $body.val().trim(),
                url: $url,
                article: $article
            };
            $.get("/api/work/update", noteUpdated)
                .then(res => {
                    //if it is found
                    if (res) {
                        console.log(res, "good");
                        var note = {
                            title: $title.val().trim(),
                            body: $body.val().trim(),
                            url: $url,
                            article: $article
                        };
                        $.ajax({
                            url: '/api/work/update',
                            type: 'PUT',
                            data: note,
                            success: () => {}
                        });
                    }
                })
        }
        isCreated = true;
    }
})()
