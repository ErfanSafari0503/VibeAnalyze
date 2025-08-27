import { Injectable, Logger } from '@nestjs/common';
import puppeteer, { Browser, Page } from 'puppeteer';
import { PostData } from 'src/analysis/types/jobs/analysis-data.interface';
import { sleep } from 'src/common/utils/sleep.util';
import { PuppeteerService } from 'src/puppeteer/puppeteer.service';

@Injectable()
export class InstagramService {

    private readonly logger = new Logger(InstagramService.name);

    private readonly igUsername = process.env.IG_USERNAME;
    private readonly igPassword = process.env.IG_PASSWORD;

    constructor(
        private readonly puppeteerService: PuppeteerService
    ) { }

    private async login(page: Page): Promise<boolean> {

        // Check if we need to login
        const loginForm = await page.$('form[id="loginForm"]');
        const loginButton = await page.$('button[type="submit"]');

        if (loginForm || loginButton) {

            this.logger.log('Login required, redirecting to login page...');

            await page.goto('https://www.instagram.com/accounts/login/', { waitUntil: 'networkidle2' });

            await sleep(3);

            // Fill login form
            const usernameInput = await page.$('input[name="username"]');
            const passwordInput = await page.$('input[name="password"]');

            if (usernameInput && passwordInput) {

                await usernameInput.type(this.igUsername, { delay: 100 });
                await passwordInput.type(this.igPassword, { delay: 100 });

                // Submit login
                await Promise.all([
                    loginButton.click(),
                    page.waitForNavigation({ waitUntil: 'networkidle2' }),
                ]);

                this.logger.log('Logged in to Instagram.');

                return true;
            }
        }

        return true;
    }

    private async simulateHumanBehavior(page: Page): Promise<void> {
        try {
            // Random mouse movements
            await page.mouse.move(Math.random() * 100, Math.random() * 100);

            // Random scroll
            await page.evaluate(() => window.scrollBy(0, Math.random() * 200));

            // Random mouse movements
            await page.mouse.move(Math.random() * 100, Math.random() * 100);

            // Back to top of the page
            await page.evaluate(() => window.scrollBy(0, 0));
        } catch (error) {
            this.logger.debug('Could not simulate human behavior:', error);
        }
    }

    async getPost(postUrl: string): Promise<void> {

        const page = await this.puppeteerService.newPage();

        // #INSTAGRAM_UNAVAILABLE
        throw new Error("Instagram data is currently unavailable.");

        try {

            //     let tryAgain: boolean;

            //     do {

            //         tryAgain = false;

            //         await page.goto(postUrl, { waitUntil: 'networkidle2' });

            //         // Wait for the page to load
            //         await sleep(2);

            //         // Get meta data
            //         const thumbnailUrl = await page.$eval('meta[property="og:image"]', element => element.getAttribute('content'));
            //         const description = await page.$eval('meta[property="og:description"]', element => element.getAttribute('content'));

            //         await this.simulateHumanBehavior(page);

            //         await this.login(page);

            //         await this.simulateHumanBehavior(page);

            //         // Get username from the post
            //         // const username = await page.$eval('div > div > div.x9f619.x1n2onr6.x1ja2u2z > div > div > div.x78zum5.xdt5ytf.x1t2pt76.x1n2onr6.x1ja2u2z.x10cihs4 > div.x9f619.xvbhtw8.x78zum5.x15mokao.x1ga7v0g.x16uus16.xbiv7yw.x1uhb9sk.x1plvlek.xryxfnj.x1c4vz4f.x2lah0s.x1q0g3np.xqjyukv.x1qjc9v5.x1oa3qoh.x1qughib > div.xvc5jky.xh8yej3.x10o80wk.x14k21rp.x17snn68.x6osk4m.x1porb0y.x8vgawa > section > main > div > div.x6s0dn4.x78zum5.xdt5ytf.xdj266r.x11t971q.xat24cr.xvc5jky.x1n2onr6.xh8yej3 > div > div.x4h1yfo > div > div.xyinxu5.xv54qhq.x1g2khh7.xf7dkkf > div > div.x9f619.xjbqb8w.x78zum5.x15mokao.x1ga7v0g.x16uus16.xbiv7yw.x1uhb9sk.x1plvlek.xryxfnj.x1iyjqo2.x2lwn1j.xeuugli.x1q0g3np.xqjyukv.x6s0dn4.x1oa3qoh.x1nhvcw1 > div > div:nth-child(1) > div:nth-child(1) > div > span > span > span > div > a > div > div > span', el => el.textContent?.trim());

            //         const username = await page.$eval('a[role="link"] span', el => el.textContent?.trim());

            //         console.log(thumbnailUrl);
            //         console.log(description);
            //         console.log(username);

            //         // // Get comments
            //         // let comments = [];
            //         // let hasContinue = false;
            //         // let continueCount = 0;

            //         // do {

            //         //     comments = await commentsContainer.$$('div:only-child > div.x78zum5.xdt5ytf.x1iyjqo2 > div');

            //         //     let loadingExists = await comments[comments.length - 1].$('div > div > div[data-visualcompletion="loading-state"]');
            //         //     hasContinue = loadingExists !== null;

            //         //     if (hasContinue) {

            //         //         await commentsContainer.evaluate(element => element.scrollTop = element.scrollHeight);

            //         //         continueCount++;

            //         //         if ((continueCount % 5) == 0) {

            //         //             await new Promise(r => setTimeout(r, 2000));
            //         //         }
            //         //     }

            //         // } while (hasContinue);

            //         // comments = await Promise.all(
            //         //     comments.map(async (element) => {

            //         //         let hiddenComment = await element.$('svg[aria-label="View hidden comments"]');

            //         //         if (hiddenComment != null) return null;

            //         //         let username = await element.evaluate((el: HTMLDivElement) => el.querySelector('div > div > div.x9f619.xjbqb8w.x78zum5.x168nmei.x13lgxp2.x5pf9jr.xo71vjh.x1uhb9sk.x1plvlek.xryxfnj.x1iyjqo2.x2lwn1j.xeuugli.x1q0g3np.xqjyukv.x1qjc9v5.x1oa3qoh.x1nhvcw1 > div.x9f619.xjbqb8w.x78zum5.x168nmei.x13lgxp2.x5pf9jr.xo71vjh.x1uhb9sk.x1plvlek.xryxfnj.x1iyjqo2.x2lwn1j.xeuugli.xdt5ytf.xqjyukv.x1qjc9v5.x1oa3qoh.x1nhvcw1 > div:nth-child(1) > div > div.x9f619.xjbqb8w.x78zum5.x168nmei.x13lgxp2.x5pf9jr.xo71vjh.x1uhb9sk.x1plvlek.xryxfnj.x1c4vz4f.x2lah0s.x1q0g3np.xqjyukv.x1qjc9v5.x1oa3qoh.x1nhvcw1 > span.x1lliihq.x1plvlek.xryxfnj.x1n2onr6.x1ji0vk5.x18bv5gf.x193iq5w.xeuugli.x1fj9vlw.x13faqbe.x1vvkbs.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.x1i0vuye.xvs91rp.xo1l8bm.x5n08af.x10wh9bi.x1wdrske.x8viiok.x18hxmgj > span')?.textContent);

            //         //         let comment = await element.evaluate((el: HTMLDivElement) => el.querySelector('div > div > div.x9f619.xjbqb8w.x78zum5.x168nmei.x13lgxp2.x5pf9jr.xo71vjh.x1uhb9sk.x1plvlek.xryxfnj.x1iyjqo2.x2lwn1j.xeuugli.x1q0g3np.xqjyukv.x1qjc9v5.x1oa3qoh.x1nhvcw1 > div.x9f619.xjbqb8w.x78zum5.x168nmei.x13lgxp2.x5pf9jr.xo71vjh.x1uhb9sk.x1plvlek.xryxfnj.x1iyjqo2.x2lwn1j.xeuugli.xdt5ytf.xqjyukv.x1qjc9v5.x1oa3qoh.x1nhvcw1 > div:nth-child(1) > div > div.x9f619.xjbqb8w.x78zum5.x168nmei.x13lgxp2.x5pf9jr.xo71vjh.x1uhb9sk.x1plvlek.xryxfnj.x1c4vz4f.x2lah0s.xdt5ytf.xqjyukv.x1cy8zhl.x1oa3qoh.x1nhvcw1 > span')?.textContent);

            //         //         if (username == null || comment == null) return null;

            //         //         return {
            //         //             username: username,
            //         //             comment: comment,
            //         //         };
            //         //     })
            //         // );

            //         // comments = comments.filter(comment => comment != null && comment.username !== username);

            //         // response.success = true;
            //         // response.data = {
            //         //     thumbnailUrl: thumbnailUrl,
            //         //     username: username,
            //         //     description: description,
            //         //     comments: comments,
            //         // };

            //     } while (tryAgain);

        } catch (err) {
            this.logger.error('Error fetching Instagram post:', err);
            throw new Error(`Failed to fetch Instagram post: ${err.message}`);
        }
    }

    async getComments(postUrl: string): Promise<void> {

        const page = await this.puppeteerService.newPage();

        // #INSTAGRAM_UNAVAILABLE
        throw new Error("Instagram data is currently unavailable.");

        try {

        } catch (err) {
            this.logger.error('Error fetching Instagram post:', err);
            throw new Error(`Failed to fetch Instagram post: ${err.message}`);
        }
    }
}
