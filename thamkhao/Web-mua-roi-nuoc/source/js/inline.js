window.dataLayer = window.dataLayer || [];
        function gtag() { dataLayer.push(arguments); }
        gtag('js', new Date());
        gtag('config', 'G-NBPTMK0M44');

// --- inline script ---

const editorPath = 'https://asset.1cdn.vn/onecms/all/editor/';

// --- inline script ---

if (window.location.href !== 'https://mega.vietnamplus.vn/mua-roi-nuoc-doi-song-tinh-than-huyen-ao-tren-mat-nuoc-5346.html') {
            window.location = 'https://mega.vietnamplus.vn/mua-roi-nuoc-doi-song-tinh-than-huyen-ao-tren-mat-nuoc-5346.html';
        }

// --- inline script ---

function closePopUp() {
            $('.popUp').removeClass('active');
        }

// --- inline script ---

var WebControl = WebControl || {};
		WebControl.PublishedTime = "2023-01-18T15:48:01Z";
        WebControl.FriendlyName = 'coi-nguon-la-suc-manh';
        WebControl.PublisherId = 5346;
        WebControl.f_share = 'https://www.facebook.com/sharer/sharer.php?app_id=985220771513216&u=https://mega.vietnamplus.vn/mua-roi-nuoc-doi-song-tinh-than-huyen-ao-tren-mat-nuoc-5346.html';
        WebControl.g_share = 'https://plus.google.com/share?url=https://mega.vietnamplus.vn/mua-roi-nuoc-doi-song-tinh-than-huyen-ao-tren-mat-nuoc-5346.html';
        WebControl.loadmore_params = function () {
            return {
                type: 'channel',
                keyword: '',
                publisherId: $('.loadArticle:last').attr('pid'),
                channelId: 270,
                eventId: 0
            };
        }
        var bookListClick = function () {
            if ($('.c-book-foot').length > 0) {
                $('.c-book-cover').click(function (e) {
                    e.preventDefault();
                    var parent = $(this).parent();
                    if (parent.hasClass('active')) {
                        $(this).removeClass('active');
                        parent.removeClass('active');
                    } else {
                        $(this).addClass('active');
                        parent.addClass('active');
                    }
                    let o1 = $(".c-book-chapters > ul").find("li").first().offset();
                    let o2 = $(".c-book-chapters > ul li.active").offset();
                    let dy = o2.top - o1.top;
                    $(".c-book-chapters > ul").animate({ scrollTop: dy }, 700);
                });
            }
        };
        $(document).ready(function () {
            WebControl.CommentDetailPage();
            WebControl.initChannelPage();
            bookListClick();

        });
        var eventF = 'mua-roi-nuoc-doi-song-tinh-than-huyen-ao-tren-mat-nuoc';
        $(".c-book-chapters ul > li > a").each(function () {
            var a = $(this).attr("data-book").toLowerCase();
            0 == a.lastIndexOf(eventF) && a.length == eventF.length && $(this).closest("li").addClass("active");
        });
        var articleCurrent = $(".c-book-chapters ul > li.active");
        if (articleCurrent.length > 0) {
            let a = parseInt(articleCurrent.find("a").attr("data-index"));
            let t = $(".c-book-chapters ul > li > a"),
                e = a - 2;

            if (a > 1) {
                let a = t.get(e);
                let html2 = `<a href="${a.href}">
                                <span class="c-book-foot__left"></span>
                                <span class="c-book-foot__text">
                                    <span class="c-book-foot__label">Bài trước</span>
                                    <span class="c-book-foot__name">${a.innerHTML}</span>
                                </span>
                            </a>
                            `;
                $(".article__Before").html(html2);
            }
            if (a < t.length) {
                let e = a,
                    o = t.get(e);
                let html1 = `<a href="${o.href}">
                                <span class="c-book-foot__text">
                                    <span class="c-book-foot__label">Bài sau</span>
                                    <span class="c-book-foot__name">${o.innerHTML}</span>
                                </span>
                                <span class="c-book-foot__right"></span>
                            </a>
                            `;
                $(".article__After").html(html1);
            }
        }

        function closePopUp() {
            $('.popUp').removeClass('active');
        }
        function openPopUpBinhLuan() {
            $('.popUp.binhLuan').addClass('active');
        }

// --- inline script ---

{
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        "mainEntityOfPage":{
        "@type":"WebPage",
        "@id":"https://mega.vietnamplus.vn/mua-roi-nuoc-doi-song-tinh-than-huyen-ao-tren-mat-nuoc-5346.html"
        },
        "headline": "M&#250;a rối nước: Đời sống tinh thần huyền ảo tr&#234;n mặt nước",
        "description": "Tiếng trống, tiếng m&#245; rộn r&#227; th&#250;c giục từng hồi, những đợt ph&#225;o thăng thi&#234;n, ph&#225;o mở cờ ngoạn mục vang l&#234;n, từng con rối bắt đầu được thổi hồn, tho&#225;t ẩn tho&#225;t hiện t&#224;i t&#236;nh tr&#234;n mặt nước. Dưới m&#225;i thủy đ&#236;nh ng&#243;i đỏ cong cong, m&#250;a rối nước ch&#237;nh l&#224; hiện th&#226;n của n&#233;t văn h&#243;a d&#226;n gian Bắc Bộ d&#226;n d&#227; m&#224; thật hồn hậu, lưu giữ một đời sống của những l&#224;ng qu&#234; v&#249;ng s&#244;ng Hồng đầy sinh động tr&#234;n mặt nước.",
        "image": {
        "@type": "ImageObject",
        "url": "https://vnp.1cdn.vn/thumbs/600x315/2023/01/04/anh-heading.png",
        "width" : 600,
        "height" : 315
        },
        "datePublished": "2023-01-18T15:48:01+07:00",
        "dateModified": "2023-01-18T15:48:01+07:00",
        "author": {
        "@type": "Person",
        "name": ""
        },
        "publisher": {
        "@type": "Organization",
        "name": "1thegioi",
        "logo": {
        "@type": "ImageObject",
        "url": "https://vnp.1cdn.vn/assets/images/global/logo.png",
        "width": 140,
        "height": 69
        }
        }
        }

// --- inline script ---

{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
        {
        "@type": "ListItem",
        "position": 1,
        "item": {
        "@id": "https://mega.vietnamplus.vn",
        "name": "Trang chủ"
        }
        },{
        "@type": "ListItem",
        "position": 2,
        "item": {
        "@id": "https://mega.vietnamplus.vn",
        "name": "Trang chủ"
        }
        }
        ]
        }