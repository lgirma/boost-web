import {FetchHttpService} from "./http";

const httpService = new FetchHttpService()

async function main() {
    document.body.innerHTML = `${(await httpService.get(`https://hacker-news.firebaseio.com/v0/item/27842933.json?print=pretty`)).title}`
}

main()