import { ConfigService } from "./config/ConfigService";
import {FetchHttpService} from "./http";

const configService = new ConfigService({
    http: {
        ApiBaseUrl: 'https://hacker-news.firebaseio.com/v0'
    }
})
const httpService = new FetchHttpService(configService)

async function main() {
    document.body.innerHTML = `${(await httpService.get(`item/27842933.json?print=pretty`)).title}`
}

main()