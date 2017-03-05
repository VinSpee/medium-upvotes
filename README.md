# Medium Upvotes

[Medium](http://medium.com) has a nice [API], but it doesn't give us what we
all _really_ want, __DAT UPVOTE COUNT BOI__.

This is a simple microservice built on [zeit's
micro](https://github.com/zeit/micro),
[got](https://github.com/sindresorhus/got),
and
[cheerio](https://github.com/cheeriojs/cheerio)
that scrapes that upvote number and returns it to you.

## USAGE

all you need is a `post` property, which can be:

- a Medium post URL: `https://medium.com/swlh/the-nine-states-of-design-5bfe9b3d6d85#.we8yp3ykt`
- a Medium vanity URL:
	`https://magenta.as/the-secret-to-great-design-a-healthy-tolerance-for-failure-f8d22b23bbd9#.jaq7e7q4i`
- a Medium post ID: `5bfe9b3d6d85`

Just post to your endpoint (the URL here is a demo endpoint running this repo's
code):

```sh
curl -H "Content-Type: application/json" -X POST -d '{"post": "https://medium.com/swlh/the-nine-states-of-design-5bfe9b3d6d85#.we8yp3ykt"}' https://my-gomix-app-mjzvrsskrg.now.sh
```

and get back:

```sh
{"data":{"upvotes":"2100","id":"5bfe9b3d6d85"}}
```


That's it!

### REQUIREMENTS
- node v6 or later
