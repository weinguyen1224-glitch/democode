(function ($) {
    $.fn.visible = function (partial) {
        var $t = $(this),
            $w = $(window),
            viewTop = $w.scrollTop(),
            viewBottom = viewTop + $w.height(),
            _top = $t.offset().top,
            _bottom = _top + $t.height(),
            compareTop = partial === true ? _bottom : _top,
            compareBottom = partial === true ? _top : _bottom;
        return ((compareBottom <= viewBottom) && (compareTop >= viewTop));
    };
})(jQuery);
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD (Register as an anonymous module)
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS
        module.exports = factory(require('jquery'));
    } else {
        // Browser globals
        factory(jQuery);
    }
}
    (function ($) {

        var pluses = /\+/g;

        function encode(s) {
            return config.raw ? s : encodeURIComponent(s);
        }

        function decode(s) {
            return config.raw ? s : decodeURIComponent(s);
        }

        function stringifyCookieValue(value) {
            return encode(config.json ? JSON.stringify(value) : String(value));
        }

        function parseCookieValue(s) {
            if (s.indexOf('"') === 0) {
                // This is a quoted cookie as according to RFC2068, unescape...
                s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
            }

            try {
                // Replace server-side written pluses with spaces.
                // If we can't decode the cookie, ignore it, it's unusable.
                // If we can't parse the cookie, ignore it, it's unusable.
                s = decodeURIComponent(s.replace(pluses, ' '));
                return config.json ? JSON.parse(s) : s;
            } catch (e) { }
        }

        function read(s, converter) {
            var value = config.raw ? s : parseCookieValue(s);
            return $.isFunction(converter) ? converter(value) : value;
        }

        var config = $.cookie = function (key, value, options) {

            // Write

            if (arguments.length > 1 && !$.isFunction(value)) {
                options = $.extend({}, config.defaults, options);

                if (typeof options.expires === 'number') {
                    var days = options.expires, t = options.expires = new Date();
                    t.setMilliseconds(t.getMilliseconds() + days * 864e+5);
                }

                return (document.cookie = [
                    encode(key), '=', stringifyCookieValue(value),
                    options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                    options.path ? '; path=' + options.path : '',
                    options.domain ? '; domain=' + options.domain : '',
                    options.secure ? '; secure' : ''
                ].join(''));
            }

            // Read

            var result = key ? undefined : {},
                // To prevent the for loop in the first place assign an empty array
                // in case there are no cookies at all. Also prevents odd result when
                // calling $.cookie().
                cookies = document.cookie ? document.cookie.split('; ') : [],
                i = 0,
                l = cookies.length;

            for (; i < l; i++) {
                var parts = cookies[i].split('='),
                    name = decode(parts.shift()),
                    cookie = parts.join('=');

                if (key === name) {
                    // If second argument (value) is a function it's a converter...
                    result = read(cookie, value);
                    break;
                }

                // Prevent storing a cookie that we couldn't decode.
                if (!key && (cookie = read(cookie)) !== undefined) {
                    result[name] = cookie;
                }
            }

            return result;
        };

        config.defaults = {};

        $.removeCookie = function (key, options) {
            // Must not alter options, thus extending a fresh object...
            $.cookie(key, '', $.extend({}, options, { expires: -1 }));
            return !$.cookie(key);
        };

    }));
function isMobile() {
    let check = false;
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
}
function get_cookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}
function convertJsonDate(param) {
    let KKK = param.substr(6, 13);
    let currentTime = new Date(parseInt(KKK));
    let month = currentTime.getMonth() + 1;
    let day = currentTime.getDate();
    let year = currentTime.getFullYear();
    let hour = currentTime.getHours();
    let minute = currentTime.getMinutes();
    let date = day + "/" + month + "/" + year + " " + hour + ":" + minute;
    return (date);
}
function frienly_title(str) {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/gui, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/gui, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/gui, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/gui, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/gui, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/gui, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/gui, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/gui, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/gui, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/gui, "Y");
    str = str.replace(/Đ/gui, "D");
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // huyền, sắc, hỏi, ngã, nặng 
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // mũ â (ê), mũ ă, mũ ơ (ư)
    str = str.replace(/\(|\)/gui, "");
    str = str.replace(/\./gui, "-");
    str = str.replace(/ /gui, "-");
    str = str.replace(/--/gui, "-");
    return str.replace("--", "-");
};
function change_title(str1) {
    str1 = str1.replace("(", "\\(");
    str1 = str1.replace(")", "\\)");
    str1 = str1.replace(".", "\\.");
    return str1;
};
function ClickPopup(url) {
    let width = 575, height = 400,
        left = (document.documentElement.clientWidth / 2 - width / 2),
        top = (document.documentElement.clientHeight - height) / 2,
        opts = 'status=1,resizable=yes' +
            ',width=' + width + ',height=' + height +
            ',top=' + top + ',left=' + left;
    win = window.open(url, '', opts);
    win.focus();
    return win;
}
function CopyToClipboard(element) {
    let $temp = $("<input>");
    $("body").append($temp);
    $temp.val($(element).attr("data-href")).select();
    document.execCommand("copy");
    $temp.remove();
    alert("Link đã được copy");
    return false;
}
function getDates() {
    let d = new Date();
    let strDate = d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();
    return strDate;
}
function numberWithCommas(convertx) {
    return convertx.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

//web control
var WebControl = WebControl || {};
WebControl.loadmore_params = () => ({ type: '24h', keyword: '', publisherId: 0, channelId: 0, eventId: 0 });
WebControl.SeoUrl = () => ({ url: '' });
WebControl.isLoading = false;
WebControl.initChannelPage = function () {
    if (WebControl.isLoading)
        return false;
    let $load_more_count = 0;
    let loadMore = function () {
        let _data = WebControl.loadmore_params();
        $('.loading_img').show();
        $('#load_more').hide();
        $.ajax({
            url: "/api/getMoreArticle",
            type: "post",
            data: _data,
            success: function (data) {
                $.each(data, function (idx, art) {
                    let html = '<li class="loadArticle" pid="' + art.PublisherId + '">\
                                        <div class="b-grid">\
                                            <div class="b-grid__image">\
                                                <a href="'+ art.LinktoMe2 + '"><img src="' + (art.Thumbnail == "" ? "/Assets/images/placeholder-image10.jpg" : art.Thumbnail_540x360) + '" alt="' + art.Title + '" title="' + art.Title + '" /></a>\
                                            </div>\
                                            <div class="b-grid__inner">\
                                                <div class="b-grid__main">\
                                                    <div class="b-grid__title">\
                                                        <a href="'+ art.LinktoMe2 + '">' + art.Title + '</a>\
                                                    </div>\
                                                </div>\
                                                <div class="b-grid__status">\
                                                    <span class="b-grid__time">' + art.TimeX1 + '</span>\
                                                </div>\
                                            </div>\
                                        </div>\
                                    </li>';
                    $('.loadAjax:first').append(html);
                });
                $('.loading_img').hide();
                if (data.length > 0) {
                    $('#load_more').show();
                }
                WebControl.isLoading = false;
            }
        })

    }

    $('#load_more').click(function () {
        loadMore();
        return false;
    });

    // scroll for loadmore
    $(window).scroll(function () {
        if ($(window).scrollTop() === $(document).height() - $(window).height()) {
            if ($load_more_count < 3) {
                loadMore();
                $load_more_count++;
            }
        }
    });
    //gift
    if ($('.gift_code').length > 0) {
        if ($.cookie('giftcode') == undefined) {
            $.post('/api/giftcode', { act: 'check', pid: WebControl.PublisherId }).done(function (json) {
                if (json.errorCode !== 0) {
                    $('.gift_code').html('');
                }
                else if (json.data && json.data > 0) {
                    $('.gift_code').html('<a has-gift="true" class="iconitem" style="text-align: center;" href="javascript:;">Nhận code</a>');
                } else {
                    $('.gift_code').html('<a class="iconitem" style="text-align: center;" href="javascript:;">Hết code</a>');
                }
            })
        } else {
            $('.gift_code').html('<span class="iconitem" style="text-align: center;" href="javascript:;">Code đã nhận: ' + $.cookie('giftcode') + '</span>');
        }

        $('.gift_code').on('click', 'a[has-gift="true"]', function () {
            $.post('/api/giftcode', { act: 'get', pid: WebControl.PublisherId }).done(function (json) {
                if (json.errorCode == 0 && $.trim(json.data) != '') {
                    $.cookie('giftcode', json.data, { path: WebControl.UrlPath, expires: 365 });
                    $('.gift_code').html('<span class="iconitem" style="text-align: center;" href="javascript:;">Code đã nhận: ' + json.data + '</span>');
                }
            })
        })

    }
}
WebControl.initDetailPage = function () {
    if (WebControl.isLoading)
        return false;
    let $load_more_count = 0;
    let loadMore = function () {
        let _data = WebControl.loadmore_params();
        $('.loading_img').show();
        $('#load_more').hide();
        $.ajax({
            url: "/api/getMoreArticle",
            type: "post",
            data: _data,
            success: function (data) {
                $.each(data, function (idx, art) {
                    let html = '<li class="loadArticle" pid="' + art.PublisherId + '">\
                                <div class="b-grid">\
                                    <div class="b-grid__img"><a href="'+ art.LinktoMe2 + '"><img src="' + (art.Thumbnail == "" ? "/Assets/images/placeholder-image10.jpg" : art.Thumbnail_540x360) + '" alt="' + art.Title + '" title="' + art.Title + '" /></a></div>\
                                    <div class="b-grid__content">\
                                        <div class="b-grid__row">\
                                            <h3 class="b-grid__title"><a href="'+ art.LinktoMe2 + '">' + art.Title + '</a></h3>\
                                        </div>\
                                        <div class="b-grid__row"><span class="b-grid__time">'+ art.TimeX + '</span><span class="b-grid__space">|</span><a class="b-grid__cat" href="' + art.LinkToChannel + '">' + art.NameChannel + '</a></div>\
                                        <div class="b-grid__row b-grid__desc">'+ art.Headlines + '</div>\
                                    </div>\
                                </div>\
                            </li>';
                    $('.loadAjax:first').append(html);
                });
                $('.loading_img').hide();
                if (data.length > 0) {
                    $('#load_more').show();
                }
                WebControl.isLoading = false;
            }
        })

    }

    $('#load_more').click(function () {
        loadMore();
        return false;
    });

    // scroll for loadmore
    $(window).scroll(function () {
        if ($(window).scrollTop() === $(document).height() - $(window).height()) {
            if ($load_more_count < 3) {
                loadMore();
                $load_more_count++;
            }
        }
    });
    //gift
    if ($('.gift_code').length > 0) {
        if ($.cookie('giftcode') == undefined) {
            $.post('/api/giftcode', { act: 'check', pid: WebControl.PublisherId }).done(function (json) {
                if (json.errorCode !== 0) {
                    $('.gift_code').html('');
                }
                else if (json.data && json.data > 0) {
                    $('.gift_code').html('<a has-gift="true" class="iconitem" style="text-align: center;" href="javascript:;">Nhận code</a>');
                } else {
                    $('.gift_code').html('<a class="iconitem" style="text-align: center;" href="javascript:;">Hết code</a>');
                }
            })
        } else {
            $('.gift_code').html('<span class="iconitem" style="text-align: center;" href="javascript:;">Code đã nhận: ' + $.cookie('giftcode') + '</span>');
        }

        $('.gift_code').on('click', 'a[has-gift="true"]', function () {
            $.post('/api/giftcode', { act: 'get', pid: WebControl.PublisherId }).done(function (json) {
                if (json.errorCode == 0 && $.trim(json.data) != '') {
                    $.cookie('giftcode', json.data, { path: WebControl.UrlPath, expires: 365 });
                    $('.gift_code').html('<span class="iconitem" style="text-align: center;" href="javascript:;">Code đã nhận: ' + json.data + '</span>');
                }
            })
        })

    }
}
WebControl.CommentDetailPage = function () {
    let $publisherId = WebControl.PublisherId;
    let $parentId = 0;
    let $sort_by = 'like';
    let $row_num = 0;

    let $load_comment_first = true;

    let $cmt_name = '';
    let $cmt_email = '';
    let $cmt_content = '';
    let $cmt_parentId = '';

    let $FriendlyName = WebControl.FriendlyName;
    let $f_share = WebControl.f_share;
    let $g_share = WebControl.g_share;

    let loadComments = function () {
        $.ajax({
            url: "/api/getcomment",
            type: "post",
            data: { publisherid: $publisherId, parentid: $parentId, sort_by: $sort_by, row_num: $row_num },
            success: function (data) {

                ////console.log(data);

                //$('.box-comment .bc-content').html('');
                $.each(data, function (idx, cmt) {
                    //console.log('load parent');
                    //console.log(cmt);

                    if ($sort_by == 'like') {
                        $sort_like = cmt.Liked;
                    }
                    else {
                        $sort_date = cmt.CreatedAt;
                    }
                    $('.contentCC:last').append('<div class="b-grid itemboxC" row_num="' + cmt.RowNum + '"><div class="b-grid__content" parentid="' + cmt.CommentId + '">'
                        + '<div class="b-grid__row"><span class="b-grid__title">' + cmt.Name + '</span> - <span class="b-grid__time">' + convertJsonDate(cmt.CreatedAt) + '</span></div>'
                        + '<div class="b-grid__row b-grid__desc" id="cmt' + cmt.CommentId + '">'
                        + cmt.Content
                        + '</div>'
                        + '<div class="b-grid__row">'
                        + '<span class="b-grid__anwser tl-reply">Trả lời</span>'
                        + '<span class="b-grid__like like" id="' + cmt.CommentId + '"><i class="icon16-heart"></i>Thích <span class="likeCount">' + cmt.Liked + '</span>'
                        + '<a class="b-grid__share" href="' + $f_share + '#cmt-' + cmt.CommentId + '"><i class="icon24-facebook"></i>Chia sẻ</a>'
                        + '</div>'
                        + '<div class="c-comment-input comment-reply hidden">'
                        + '<div class="form-group">'
                        + '<textarea class="form-control txt-content" name="" placeholder="Vui lòng nhập tiếng việt có dấu"></textarea>'
                        + '<label class="control-label help-block"><em></em></label> <br />'
                        + '<a href="javascript:void(0)" class="btnSend btn-send-comment" parentid="' + cmt.CommentId + '">Gửi bình luận</a>'
                        + '<span> </span>'
                        + '<a class="btn-close-comment" href="javascript:void(0)" parentid="0">Đóng</a>'
                        + '</div>'
                        + '</div>'
                        + '<div class="b-grid__sub itemboxC">'
                        + '</div>'
                        + '</div>'
                        + '</div>'
                        + '</div><!-- b-grid -->');
                    if (cmt.ChildComment.length > 0) {
                        //$('.itemboxC:last').after('<div class="itemBox tl"></div>');
                    }
                    $.each(cmt.ChildComment, function (idx2, cmt2) {
                        //console.log(cmt2);
                        $('.itemboxC:last').append('<div class="b-grid itemboxC" row_num="' + cmt.RowNum + '"><div class="b-grid__content" parentid="' + cmt.CommentId + '">'
                            + '<div class="b-grid__row"><span class="b-grid__title">' + cmt2.Name + '</span> - <span class="b-grid__time">' + convertJsonDate(cmt2.CreatedAt) + '</span></div>'
                            + '<div class="b-grid__row b-grid__desc" id="cmt' + cmt2.CommentId + '">'
                            + cmt2.Content
                            + '</div>'
                            + '<div class="b-grid__row">'
                            + '<span class="b-grid__anwser tl-reply">Trả lời</span>'
                            + '<span class="b-grid__like like" id="' + cmt2.CommentId + '"><i class="icon16-heart"></i>Thích <span class="likeCount">' + cmt2.Liked + '</span></span>'
                            + '<a class="b-grid__share" href="' + $f_share + '#cmt-' + cmt2.CommentId + '"><i class="icon24-facebook"></i>Chia sẻ</a>'
                            + '</div>'
                            + '<div class="c-comment-input comment-reply hidden">'
                            + '<div class="form-group">'
                            + '<textarea class="form-control txt-content" name="" placeholder="Vui lòng nhập tiếng việt có dấu"></textarea>'
                            + '<label class="control-label help-block"><em></em></label> <br />'
                            + '<a href="javascript:void(0)" class="btnSend btn-send-comment" parentid="' + cmt.CommentId + '">Gửi bình luận</a>'
                            + '<span> </span>'
                            + '<a class="btn-close-comment" href="javascript:void(0)" parentid="0">Đóng</a>'
                            + '</div>'
                            + '</div>'
                            + '</div>'
                            + '</div>'
                            + '</div><!-- b-grid -->');
                    })
                    // $('.box-comment .bc-content').append($comt)
                    if (cmt.ChildComment.length == 3) {
                        $('.box-comment .bc-content').find('.ci-sub:last').append('<div class="bc-more"><a href="#" class="comment-load-more-child small">Xem thêm...</a></div> ')
                    }
                });

                //first run
                if ($load_comment_first) {
                    if (data.length > 0) {
                        $('.box-comment .no-comment').addClass('hidden');
                        $('.box-comment .parent-load-more').removeClass('hidden');
                    } else {
                        $('.box-comment .no-comment').removeClass('hidden');
                        $('.box-comment .parent-load-more').addClass('hidden');
                    }

                    var $target = $(window.location.hash);
                    if ($target != null && $target != undefined && $target.offset() != undefined) {
                        $('html, body').stop().animate({
                            'scrollTop': $target.offset().top
                        }, 500, 'swing', function () { });
                    }
                    $load_comment_first = false;
                }

                //waitingDialog.hide();
            },
        });


    }
    let sendComment = function () {
        let name = $.trim($cmt_name);
        let email = $.trim($cmt_email);
        let content = $.trim($cmt_content).replace(/\r\n|\r|\n/g, "<br/>");
        $.ajax({
            url: "/api/addcomment",
            type: "post",
            data: { p: $cmt_parentId, a: $publisherId, n: name, e: email, c: content },
            success: function (data) {
                //console.log(data);
                data = JSON.parse(data);
                if (data.errorCode == 2) {
                    alert('Bạn phải chờ sau 1 phút sau mới được tiếp tục gửi ý kiến !');
                } else {
                    $('.txt-content').val('');
                    $('#txtName').val('');
                    $('#txtEmail').val('');
                    $('.form').removeClass('has-error');
                    $('.comment-item').find('.bc-input').addClass('hidden');
                    $('.popUp.binhLuan').removeClass('active');
                    $('.comment-reply').addClass('hidden');
                    let $target_message = $('.commentForms');
                    $('.message').removeClass('hidden');
                    $('html, body').stop().animate({
                        'scrollTop': $target_message.offset().top - 10
                    }, 300, 'swing', function () { });
                }

            },
        });

    }

    //load first top comment
    loadComments();
    $('li.comment-sort-by-like').click(function () {
        if ($(this).hasClass('active'))
            return false;
        $('li.comment-sort-by-newest').removeClass('active');
        $(this).addClass('active');

        $sort_by = 'like';
        $row_num = 0;

        //waitingDialog.show();
        $('.contentCC').html('');
        loadComments();

        return false;
    });
    $('li.comment-sort-by-newest').click(function () {
        if ($(this).hasClass('active'))
            return false;
        $('li.comment-sort-by-like').removeClass('active')
        $(this).addClass('active');

        $sort_by = 'date';
        $row_num = 0;

        //waitingDialog.show();
        $('.contentCC').html('');
        loadComments();

        return false;
    });

    $('.c-comments').on('click', '.like', function () {
        let _commentId = $(this).attr('id');
        let aaa = $(this);
        let like_val = aaa.find('.likeCount').text();
        $.ajax({
            url: "/api/addlikecomment",
            type: "post",
            data: { cmt: _commentId },
            success: function (data) {
                data = JSON.parse(data);
                if (data.errorCode == 0) {
                    $(this).addClass('active');

                    aaa.find('.likeCount').html((parseInt(like_val) + 1).toString());
                    alert('Like thành công, sau vài phút ý kiến sẽ được cập nhật số lượng like !');
                    aaa.removeClass('like');
                    return false;
                }
                else if (data.errorCode == 2) {
                    alert('Bạn phải chờ sau 1 phút sau mới được tiếp tục like ý kiến !');
                    return false;
                }
            },
        })
    });
    $('.c-comments').on('click', '.tl-reply', function () {
        let _commentId = $(this).closest('.b-grid__content').attr('parentid');
        $parentId = _commentId;
        //show commentbox
        $(this).closest('.b-grid__content').find('.comment-reply:first').removeClass('hidden');
        return false;
    });
    $('.c-comments').on('click', '.btn-close-comment', function () {
        $(this).closest('.comment-reply').addClass('hidden');
        return false;
    });
    //send click
    $('.c-comments').on('click', '.btnSend', function () {
        let $txtContent = $(this).closest('.c-comment-input').find('.txt-content:first');
        $cmt_content = $txtContent.val();
        $cmt_parentId = $(this).attr('parentid');
        $txtContent.closest('.c-comment-input').removeClass('has-error');
        $txtContent.closest('.c-comment-input').find('em').html('');
        if ($cmt_content.length == 0) {
            $txtContent.closest('.c-comment-input').addClass('has-error').find('em').html('Bạn chưa nhập nội dung ý kiến !');
            $('.txt-content').focus();
            return false;
        } else if ($cmt_content.length < 10) {
            $txtContent.closest('.c-comment-input').addClass('has-error').find('em').html('Nội dung ý kiến quá ngắn !');
            return false;
        } else if ($cmt_content.length > 1000) {
            $txtContent.closest('.c-comment-input ').addClass('has-error').find('em').html('Nội dung ý kiến quá dài !');
            return false;
        }
        //show input author
        $('.popUp.binhluancomment').addClass('active');
        return false;
    });

    $('.btnSendComment').on('click', (function () {
        let $txtName = $('#txtName');
        let $txtEmail = $('#txtEmail');

        $cmt_name = $.trim($txtName.val());
        $cmt_email = $.trim($txtEmail.val());
        $('#binhluanmodal').find('.form').removeClass('has-error');
        $('#binhluanmodal').find('em').html('');
        if ($cmt_name.length == 0) {
            $txtName.closest('.box').addClass('has-error').find('em').html('Bạn chưa nhập họ và tên !');
            return false;
        } else if ($cmt_email.length == 0) {
            $txtEmail.closest('.box').addClass('has-error').find('em').html('Bạn chưa nhập địa chỉ email !');
            return false;
        }
        //send comment
        sendComment();
        return false;
    }));

    //load more comment
    $('.c-comments').on('click', '.comment-load-more', function () {
        $parentId = 0;
        $row_num = $('.b-grid.itemboxC:last:last').attr('row_num');
        loadComments();

        return false;
    });
    // ++++++ load comment con //
    $('.box-comment').on('click', '.comment-load-more-child', function () {

        let that = this;
        $parentId = $(this).closest('.ci-sub').attr('parentid');
        $row_num = $(this).closest('.ci-sub').find('.comment-item:last').attr('row_num');

        //waitingDialog.show();
        $.ajax({
            url: "/api/getcomment",
            type: "post",
            data: { publisherid: $publisherId, parentid: $parentId, sort_by: $sort_by, row_num: $row_num },
            success: function (data) {
                //console.log(data);
                $.each(data, function (idx2, cmt2) {
                    //console.log(cmt2);
                    $(that).before(''
                        + '<div class="comment-item  grid" id="' + cmt2.CommentId + '" row_num="' + cmt2.RowNum + '">'
                        + '<div class="img"><a href="javascript:;"><img src="https://btnmt.onecmscdn.com/assets/img/avatar.jpg" alt="' + cmt2.Name + '"></a></div>'
                        + '<div class="g-content">'
                        + '     <div class="ci-row g-row" id="cmt-' + cmt2.CommentId + '"><span class="ci-name g-title">' + cmt2.Name + '</span> - <span class="ci-time">' + formatJSONDate(cmt2.CreatedAt) + '</span></div>'
                        + '     <div class="ci-row g-row">'
                        + '          ' + cmt2.Content + ''
                        + '     </div>'
                        /////
                        //+ '<div class="comment-item" id="' + cmt2.CommentId + '" row_num="' + cmt2.RowNum + '">'
                        //+ ' <div class="ci-row" id="cmt-' + cmt2.CommentId + '"><span class="ci-name">' + cmt2.Name + '</span> - <span class="ci-time">' + formatJSONDate(cmt2.CreatedAt) + '</span></div>'
                        //+ '     <div class="ci-row">'
                        //+ '      ' + cmt2.Content + ''
                        //+ '      </div>'
                        + '     </div>'
                        + '     <div class="g-row">'
                        + '             <span class="g-count btn-like"><i class="fa fa-thumbs-o-up"></i>' + cmt2.Liked + ' Thích</span>'
                        + '             <span class="g-comment btn-answer"><i class="fa fa-comments"></i>Trả lời</span>'
                        + '     </div>'
                        + ' </div>'
                        + '</div>');
                    //////////////////////
                    //+ '  <div class="ci-row">'
                    //+ '   <a class="btn-like" href="#">Thích <span>' + cmt2.Liked + '</span></a>'
                    //+ '   <a class="btn-share social-share" href="' + $f_share + '#cmt-' + cmt2.CommentId + '" target="_blank"><i class="share-facebook"></i></a>'
                    //+ '   <a class="btn-share social-share" href="' + $g_share + '#cmt-' + cmt2.CommentId + '" target="_blank"><i class="share-google-plus"></i></a>'
                    //+ '  </div>'
                    //+ '</div>');
                })
                //waitingDialog.hide();
            }
        })

        return false;
    });

    $('.box-news').on('click', 'a.social-share', function () {
        let url = $(this).attr('href');
        ClickPopup(url);
        return false;
    });


}
WebControl.Answer = function () {
    let $publisherId = WebControl.PublisherId;
    let LABEL_CORRECT = ["Bạn là thần đồng", "Bạn rất xuất sắc", "Kiến thức của bạn không tồi", "Bạn có thể làm tốt hơn thế"];
    let t = $("<p>", { id: "quiz_result" }).html("<span class='message'>Hãy trả lời các câu hỏi để biết kết quả của bạn</span>");
    if ($('.quiz-caption').length > 0) {
        $(".leftDetail .description").append(t);
    }

    let a = $(".quiz ul").length;
    $("#quiz_total").html(a);
    let s = 0,
        e = 0;
    let sendTraloicauhoi = function () {
        let name = $.trim($cmt_name);
        let email = $.trim($cmt_email);
        let Traloi = $('.correct.selected').length + "/" + $('.description .quiz').length;
        $.ajax({
            url: "/api/sendAnswer",
            type: "post",
            data: { p: $publisherId, n: name, e: email, t: Traloi },
            success: function (data) {
                //console.log(data);
                data = JSON.parse(data);
                if (data.errorCode == 2) {
                    alert('Bạn phải chờ sau 1 phút sau mới được tiếp tục gửi ý kiến !');
                } else {
                    let $target_message = $('.messagetl');
                    $target_message.removeClass('hidden');
                    $('html, body').stop().animate({
                        'scrollTop': $('.formComment').offset().top
                    }, 300, 'swing', function () { });

                }
                $('.ketquatraloi #txtName').val('');
                $('.ketquatraloi #txtEmail').val('');
                $('.ketquatraloi .form').removeClass('has-error');
                $('.popUp.ketquatraloi').removeClass('active');
                $('#traloiketqua').css({ "display": "none" });
            }
        });

    };
    $(".quiz li strong").each(function (t, a) {
        $(a).parents("  li").addClass("correct");
    })
    $(".quiz li").on("click", function (n) {
        n.preventDefault();

        let i = $(this).parents(".quiz");
        if (!i.hasClass("answered")) {
            if (e++, $(this).hasClass("correct") && s++, e == a) {
                t.append('<span id="correct">' + s + '</span><span id="total">' + a + "</span>");
                let c = 100 * s / a;
                100 == c ? t.find(".message").html(LABEL_CORRECT[0]) : c >= 80 ? t.find(".message").html(LABEL_CORRECT[1]) : c >= 50 ? t.find(".message").html(LABEL_CORRECT[2]) : t.find(".message").html(LABEL_CORRECT[3])
                $('#quiz_result').append('<span id="traloiketqua">Gửi kết quả trả lời</span>');
            }
            i.addClass("answered"), $(this).addClass("selected");
            $("#traloiketqua").on("click", function (n) {
                n.preventDefault();
                $('.popUp.ketquatraloi').addClass('active');
                $(".ketquatraloi").find('.kqtl').html('<span id="correct">' + $('.correct.selected').length + '</span><span id="total">' + $('.description .quiz').length + "</span>");
                return false;
            });
            $(".btnTraloicauhoi").off('click').on("click", function () {
                let $txtName = $('.ketquatraloi #txtName');
                let $txtEmail = $('.ketquatraloi #txtEmail');
                $cmt_name = $.trim($txtName.val());
                $cmt_email = $.trim($txtEmail.val());
                $('#binhluanmodal').find('.form').removeClass('has-error');
                $('#binhluanmodal').find('em').html('');
                if ($cmt_name.length == 0) {
                    $txtName.closest('.box').addClass('has-error').find('em').html('Bạn chưa nhập họ và tên !');
                    return false;
                } else if ($cmt_email.length == 0) {
                    $txtEmail.closest('.box').addClass('has-error').find('em').html('Bạn chưa nhập địa chỉ email !');
                    return false;
                }
                //send comment
                sendTraloicauhoi();
                return false;
            });
        }
    });


};
WebControl.ExchangeRate = function () {
    if ($(".ExchangeRate").length == 0) return false;
    let loadTygia = function () {
        $.ajax({
            url: "/api/GetTyGia",
            type: "get",
            success: function (data) {
                if (data === undefined || data.length == 0) return false;
                data.forEach(function (item) {
                    if (item.Type === 1) $(".bg__currency").append('<tr>\
                                            <td>' + item.CurrencyCode + '</td>\
                                            <td class="text-center">'+ numberWithCommas(item.Buy) + '</td>\
                                            <td class="text-center">'+ numberWithCommas(item.Sell) + '</td>\
                                            <td class="text-center">'+ numberWithCommas(item.Transfer) + '</td>\
                                        </tr>');
                    if (item.Type === 2) $(".bd__gold").append('<tr>\
                                            <td>' + item.CurrencyCode + '</td>\
                                            <td class="text-center">'+ numberWithCommas(item.Buy) + '</td>\
                                            <td class="text-center">'+ numberWithCommas(item.Sell) + '</td>\
                                        </tr>');
                    if (item.Type === 4) $(".bg__petroleum").append('<tr>\
                                            <td>' + item.CurrencyCode + '</td>\
                                            <td class="text-center">'+ numberWithCommas(item.Buy) + '</td>\
                                            <td class="text-center">'+ numberWithCommas(item.Sell) + '</td>\
                                        </tr>');

                });
            }
        });
    }
    loadTygia();
}
WebControl.Vote = function () {
    let modal = document.getElementById('myModal');

    // Get the button that opens the modal


    // Get the <span> element that closes the modal
    let span = document.getElementsByClassName("close")[0];

    // When the user clicks the button, open the modal 


    // When the user clicks on <span> (x), close the modal
    if (span) {
        span.onclick = function () {
            modal.style.display = "none";
        };
    }
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
    let get_cookies = get_cookie("cl_vote");

    if (get_cookies != "" && get_cookies !== null) {
        let idVote = "ks_checkbox" + get_cookies;
        $("label[for= " + idVote + "]").css("color", "#9F224E");
        $("input.form-check-input").each(function () {
            let voteId = idVote;
            if ($(this).attr("id") == voteId) {
                $(this).prop('checked', true);
            }
            else {
                $(this).prop("disabled", true);
            }
        })

        $("#binhchon").css("display", "none");
    }
    let binhtron = function () {
        let surveyId = $(".form-check input[type='radio']:checked").val();
        if (surveyId == undefined) {
            alert('Bạn chưa chọn thông tin khảo sát!');
            return false;
        }

        $.ajax({
            url: "api/survey",
            type: "POST",
            data: { surveyId: surveyId },
            success: function (data) {
                data = JSON.parse(data);
                if (data.errorCode == 0) {
                    //$('.form-check-input').prop('checked', false);
                    let idVote = "ks_checkbox" + surveyId;
                    $("label[for= " + idVote + "]").css("color", "#9F224E");
                    $("input.form-check-input").each(function () {
                        let voteId = idVote;
                        if ($(this).attr("id") == voteId) {
                            $(this).prop('checked', true);
                        }
                        else {
                            $(this).prop("disabled", true);
                        }
                    })
                    $("#binhchon").css("display", "none");

                    alert('Cám ơn bạn đã gửi bình chọn !');

                }
                else {
                    console.log("error...");
                }
            }

        })
    };
    $('#ketqua').click(function () {
        // $('#myModal').modal('show');
        let btn = document.getElementById("ketqua");
        let modal = document.getElementById('myModal');
        if (modal == undefined || modal === null) {
            return false;
        }
        btn.onclick = function () {
            modal.style.display = "block";
        }


        $.ajax({
            url: "/api/getvotesurvey",
            type: "get",
            //data: { publisherid: $publisherId, parentid: $parentId, sort_by: $sort_by, row_num: $row_num },
            success: function (res) {

                let data_label = [];
                let data_value = [];

                for (i = 0; i < res.length; i++) {
                    data_label.push(res[i]['Answer']);
                }
                for (i = 0; i < res.length; i++) {
                    data_value.push(res[i]['TotalVote']);
                }



                let ctx = document.getElementById("canvas").getContext('2d');
                let myChart = new Chart(ctx, {
                    type: 'pie',
                    data: {
                        //labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
                        labels: data_label,
                        datasets: [{
                            label: '# of Votes',
                            data: data_value,
                            backgroundColor: [
                                'rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgb(255, 205, 86)', 'rgb(75, 192, 192)', 'rgb(153, 102, 255)', 'rgb(255, 159, 64)'
                            ],
                            borderColor: [
                                'rgba(255,99,132,1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 159, 64, 1)'
                            ],
                            borderWidth: 1
                        }]
                    },
                    //options: {
                    //    scales: {
                    //        yAxes: [{
                    //            ticks: {
                    //                beginAtZero: true
                    //            }
                    //        }]
                    //    }
                    //}
                });
            },
        });
        modal.style.display = "block";
        //$('#myModal').modal('show');
    })
    $("#binhchon").click(function () {
        binhtron();
    });
}
WebControl.CodeIndex = function () {
    if ($(".bg__codeindex").length == 0) return false;
    let loadCodeIndex = function () {
        $.ajax({
            url: "/api/getMoreCodeIndex",
            type: "get",
            success: function (_data) {
                if (_data.length == 0) return false;
                let _dataJson = JSON.parse(_data);
                if (_dataJson !== undefined) {
                    $.each(_dataJson, function (idx, codeindex) {
                        $('.bg__codeindex').append('<tr>\
                                            <td><b>'+ codeindex.CodeIndex + '</b></td>\
                                            <td class="text-right"> '+ codeindex.Index + '<i class="icon8-' + (codeindex.Change.indexOf("+") === -1 ? "down" : "up") + '"></i></td>\
                                            <td class="text-right"><span class="bg-' + (codeindex.Change.indexOf("+") === -1 ? "danger" : "success") + '">' + codeindex.Change + '</span></td>\
                                            <td class="text-right"><span class="bg-' + (codeindex.PercentChange.indexOf("+") === -1 ? "danger" : "success") + '">' + codeindex.PercentChange + '%</span></td>\
                                        </tr>');
                    });
                }
            },
            error: function (errorMessage) {
                console.log("error" + errorMessage);
            }
        });
    }
    loadCodeIndex();
}
WebControl.GetWeather = function () {
    if ($(".onecms__weather").length == 0) return false;
    let loadDataWeather = function () {
        $.ajax({
            url: "/api/GetWeather",
            type: "get",
            success: function (_data) {
                _data = JSON.parse(_data);
                if (_data.err === undefined || _data.err == 1 || _data.data.weather === undefined || _data.data.weather.length === 0) return false;
                $(".onecms__weather").append('<div id="widget-weather">\
                            <ul class="current-city"></ul>\
                            <div class="filter">\
                                <input placeholder="Nhập tìm tỉnh thành …">\
                                <div class="city-list">\
                                    <div class="choosed-city"></div>\
                                    <div class="others-city">\
                                        <p>Tỉnh thành khác</p>\
                                        <ul></ul>\
                                        <div class="no-result hide" style="display:none"><i class="ti-info-alt"></i> Không tìm thấy kết quả</div>\
                                    </div>\
                                </div>\
                            </div>\
                        </div>');
                let data_weather = _data.data.weather;
                let data_weather_hanoi = data_weather.find(x => x.Code == "hanoi");
                if (data_weather_hanoi !== undefined) {
                    $(".current-city").append('<li><strong>' + data_weather_hanoi.City + '</strong><span><em>' + data_weather_hanoi.MaxT + '°C</em> / ' + data_weather_hanoi.MinT + " - " + data_weather_hanoi.MaxT + '°C</span><img src="' + data_weather_hanoi.CP.replace("https://static-znews.zingcdn.me/images/icons/weather/v2", "https://asset.1cdn.vn/vkts/images/weather") + '" alt=""><i class="ti-arrow-circle-down"></i></li>');
                    $(".choosed-city").append('<p>Đang hiển thị</p>\
                                        <ul>\
                                            <li>'+ data_weather_hanoi.City + '<span>' + data_weather_hanoi.MaxT + '°C<img src="' + data_weather_hanoi.CP.replace("https://static-znews.zingcdn.me/images/icons/weather/v2", "https://asset.1cdn.vn/vkts/images/weather") + '" alt=""></span></li>\
                                        </ul>');
                };
                data_weather.sort(function (a, b) {
                    const nameA = a.Code.toUpperCase(); // ignore upper and lowercase
                    const nameB = b.Code.toUpperCase(); // ignore upper and lowercase
                    if (nameA < nameB) {
                        return -1;
                    }
                    if (nameA > nameB) {
                        return 1;
                    }

                    // names must be equal
                    return 0;
                });
                $.each(data_weather, function (idx, data_w) {
                    $(".others-city ul").append('<li city="' + data_w.City.toLowerCase() + '" city1="' + frienly_title(data_w.City).replace("-", " ").toLowerCase() + '">' + data_w.City + '<span>' + data_w.MaxT + '°C<img src="' + data_w.CP.replace("https://static-znews.zingcdn.me/images/icons/weather/v2", "https://asset.1cdn.vn/vkts/images/weather") + '" alt=""></span></li>');
                });

            },
            error: function (errorMessage) {
                console.log("error" + errorMessage);
            }
        });
    };
    function SeachWeather(input) {
        if (input === undefined) return false;
        input = input.trim();
        $('.others-city ul li').each(function () {
            if ((input == '' || $(this).attr("city").indexOf(input) != -1 || $(this).attr("city1").indexOf(input) != -1)) {
                $(this).css('display', 'flex');
            } else {
                $(this).css('display', 'none');
            }

            if ($('.others-city ul li[style="display: flex;"]').length === 0) {
                $(".no-result").css('display', 'block');
            }
            else {
                $(".no-result").css('display', 'none');
            }
        });
    }
    $(window).ready(function () {
        $(".onecms__weather").on("keyup", ".filter input", function () {
            SeachWeather($(this).val().toLowerCase());
        });
        $(".onecms__weather").on("click", ".current-city", function (e) {
            $("#widget-weather").addClass('expanded');
            e.stopPropagation();
        });
        $(document).click(function (e) {
            if (!$(e.target).is('.onecms__weather .filter, .onecms__weather .filter *')) {
                $("#widget-weather").removeClass('expanded');
            }
        });
    });

    loadDataWeather();

}
$(document).ready(function () {
    $('.btnSearch').click(function () {
        let keyword = $(this).closest(".c-search__inner").find('#txt-keyword').val();
        if (keyword !== undefined && $.trim(keyword) != '') {
            window.location = '/search?q=' + keyword.replace(/\s/gi, "+");
        }
        return true;
    });
    $('#txt-keyword').keyup(function (evt) {
        if (evt.keyCode == 13 || evt.which == 13) {
            $('.btnSearch').trigger('click');
            return false;
        }
        return true;
    });
    $('#btnStocksSearch').click(function () {
        let keyword = $('#stocksInput').val();
        if ($.trim(keyword) != '') {
            window.location = '/stock/' + keyword.replace(/\s/gi, "+") + '.html';
        }
        return true;
    });
    $('#stocksInput').keyup(function (evt) {
        if (evt.keyCode == 13 || evt.which == 13) {
            $('#btnStocksSearch').trigger('click');
            return false;
        }
        return true;
    });
    $('.fb').click(function (e) {
        ClickPopup($(this).attr('href'));
        return false;
    });
    $('.copy__link').click(function (e) {
        e.preventDefault();
        CopyToClipboard(this);
        return false;
    });
    $(".backLink").click(function (event) {
        event.preventDefault();
        history.back(1);
    });
    $(".print").click(function () {
        let axx = $(this).attr("href");
        ClickPopup(axx);
        return false;
    });
    if ($(".content-main-normal").length > 0) {
        let tagg = [];
        let contentxx = $(".content-main-normal").html();
        $(".onecms__tags a").each(function () {
            let tag = $(this).text().trim();
            tagg.push(tag);
        });
        if (tagg.length > 0) {
            let contentx = $(".content-main-normal").html();
            try {
                for (i = 0; i < tagg.length; i++) {
                    let regexExpression = "(?!(?:[^<]+>|[^>]+<\\/a>))\\b(" + change_title(tagg[i].trim()) + ")(?:\s)?\\b";
                    let regex = new RegExp(regexExpression, "imu");
                    contentx = contentx.replace(regex, "<a href='/" + frienly_title(unescape(tagg[i])) + "-ptag.html" + "' title = '" + tagg[i] + "'>$1" + "</a>");
                }
                $(".content-main-normal").html(contentx);
            }
            catch (e) {
                $(".content-main-normal").html(contentxx);
                console.log(e.message);
            }
        }
    };
    $('.commentScroll').click(function () {
        let $target_message = $('.formComment');
        $target_message.removeClass('hidden');
        $('html, body').stop().animate({
            'scrollTop': $target_message.offset().top - 50
        }, 700, 'swing', function () { });
        $('.txt-content').focus();
        $("textarea").css("border", "1px solid #11e666");
    });
    $("a.comment").click(function () {
        $('html,body').animate({
            scrollTop: $('.c-tags').offset().top - 20
        }, 700);
        $('.txt-content').focus();
    });
    $(".c-project-info").length > 0 && ($(".c-project-info__more .expand").click(function (e) { e.preventDefault(); let t = $(this).parent().parent(); $(t).addClass("active") }), $(".c-project-info__more .collapse").click(function (e) { e.preventDefault(); let t = $(this).parent().parent(); $(t).removeClass("active") }));
    //WebControl.GetWeather();
});