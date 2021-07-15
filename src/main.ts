import { SimpleConfigService } from "./config/ConfigService";
import {FetchHttpService} from "./http";
import { Simplei18nService } from "./i18n/i18nService";
import { JWTAuthService, SimpleSecurityService } from "./security";
import { DialogService } from "./ui";
import { AlertDialogService } from "./ui/AlertDialogService";
import { AlertToastService } from "./ui/AlertToastService";
import { ToastService } from "./ui/ToastService";

const configService = new SimpleConfigService({
    http: {
        ApiBaseUrl: 'https://hacker-news.firebaseio.com/v0'
    }
})
const httpService = new FetchHttpService(configService)
const securityService = new SimpleSecurityService(configService)
const authService = new JWTAuthService(configService, securityService, httpService)
const i18n = new Simplei18nService(configService)
const toastService: ToastService = new AlertToastService(i18n)
const dialogService: DialogService = new AlertDialogService()

async function main() {
    //document.body.innerHTML = `${(await httpService.get(`item/27842933.json?print=pretty`)).title}`
    let newElt = document.createElement('form')
    newElt.innerHTML =
        `<div>
            <label>Email: <input type="email" id="email"></label>
        </div>
        <div>
            <label>Password: <input type="password" id="password"></label>
        </div>
        <div>
            <input type="submit" value="Login">
        </div>`
    newElt.onsubmit = async e => {
        e.preventDefault()
        if (!await dialogService.showConfirmAsync('Are you sure?'))
            return
        try {
            await authService.login({
                password: newElt.password.value,
                userId: newElt.email.value
            })
            toastService.showSuccess('Login success.')
        } catch (er) {
            toastService.showError('Login failed.')
        }
    }
    document.body.append(newElt)
}

main()