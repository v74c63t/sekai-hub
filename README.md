# _Sekai Hub_

<!-- Submitted by: **Vanessa Tang** -->

**This is a forum web app that allows users to post and interact with others about Project SEKAI COLORFUL STAGE, a mobile rhythm game featuring Virtual Singers such as Hatsune Miku.**

<!-- Time spent: **56** hours spent in total -->

## Implemented Features


-   [x] **A create form that allows the user to create posts**
-   [x] **Posts have a title and optionally additional textual content and/or an image added as an external image URL**
-   [x] **A home feed displaying previously created posts**
-   [x] **By default, the time created, title, and number of upvotes for each post is shown on the feed**
-   [x] **Clicking on a post shall direct the user to a new page for the selected post**
-   [x] **Users can sort posts by either their created time or upvotes count**
-   [x] **Users can search for posts by title**
-   [x] **A separate post page for each created post, where any additional information is shown is linked whenever a user clicks a post**
-   [x] **Users can leave comments underneath a post on the post's separate page**
-   [x] **Each post should have an upvote button on the post's page. Each click increases its upvotes count by one and users can upvote any number of times**
-   [x] **A previously created post can be edited or deleted from its post page**
-   [x] **Users can only edit and deleted posts by entering the secret key, which is set by the user during post creation**
-   [x] **Upon launching the web app, the user is assigned a random user ID. It will be associated with all posts and comments that they make and displayed on them.**
-   [x] **Users can customize the interface of the web app based on the different groups in the game**
-   [x] **Users can share and view web videos**
-   [x] **Users can set flairs while creating a post. Then users can filter posts by flairs on both the home feed and the search results page.**
-   [x] **Users can upload images directly from their local machine as an image file**
-   [x] **Display a loading animation whenever data is being fetched**
-   [x] **A preview tab to allows users to preview their image or video while creating or updating a post**
<!-- -   [ ] Users can repost a previous post by referencing its post ID. On the post page of the new post, the referenced post is displayed and linked, creating a thread -->


## Video Walkthrough

Here's a walkthrough of the implemented user stories:

<img src='walkthrough.gif' title='Video Walkthrough' width='' alt='Video Walkthrough' />

<!-- Replace this with whatever GIF tool you used! -->

GIF created with [Kap](https://getkap.co/) for macOS

<!-- Recommended tools:
[Kap](https://getkap.co/) for macOS
[ScreenToGif](https://www.screentogif.com/) for Windows
[peek](https://github.com/phw/peek) for Linux. -->

<!-- ## Notes

Describe any challenges encountered while building the app.

I had some issues with implementing the search by title functionality most because I decided to place my search bar in the nav bar. Originally, I wanted the posts to update directly on the home page based on the search query that the user inputted, but that ended up causing a lot of issues with some variables as well as sorting and filtering so I just decided to create a separate search result page instead. 

Other than that, I encountered several issues with implementing some of the optional features. At first, I wanted to allow users to upload both images and videos directly from their local machine and I would save those files in Cloudinary, but the free plan I was on restricted it so I am unable to upload video files that are more than 100 MB. Considering the fact that one gameplay video that only contains me playing one song was already significantly over 100 MB, I disgarded that idea and only allowed users to upload images. Afterwards, when I was trying to work out updates and deletions with this, I ran into more problems. Ultimately, I wanted to delete the uploaded image associated with a post if the user intends to delete the post or update the post with a new image/video because it makes sense to free up space if the image is no longer needed. This ended up causing a lot of headaches because I could not find an easy way to delete images that were uploaded to Cloudinary. I looked through their documentation multiple times, but there was not a simple way to do so. I tried using their API, but that required me to generate a signature and I could not figure out how to do so easily. The second way was to use their SDK, but the function they showed just did not work. In the end, I just switched everything over to Firebase, which worked way better. -->

## License

    Copyright [2024] [Vanessa Tang]

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
