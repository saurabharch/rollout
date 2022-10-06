const moment = require('moment');
const handlebars = require('express-handlebars');
const i18n = require('i18n');
const {
  getConfig,
  getPaymentConfig
} = require('../lib/config');
// get config
const config = getConfig();
var winston = require('../../config/winston');
// Language initialize
i18n.configure({
  locales: config.availableLanguages,
  defaultLocale: config.defaultLocale,
  cookie: "locale",
  queryParameter: "lang",
  directory: `${__dirname}/locales`,
  directoryPermissions: "755",
  api: {
    __: "__", // now req.__ becomes req.__
    __n: "__n" // and req.__n can be called as req.__n
  }
});
module.exports = {
  truncate: function(str, len){
    if(str.length > len && str.length > 0){
      let new_str = `${str} `;
      new_str = str.substr(0, len);
      new_str = str.substr(0, new_str.lastIndexOf(' '));
      new_str = new_str.length > 0 ? new_str : str.substr(0, len);
      return `${new_str}....`;
    }
    return str;
  },
  math: function(lvalue, operator, rvalue){
    lvalue = parseFloat(lvalue);
    rvalue = parseFloat(rvalue);
    return {
      '+': lvalue + rvalue,
      '-': lvalue - rvalue,
      '*': lvalue * rvalue,
      '/': lvalue / rvalue,
      '%': lvalue % rvalue,
      '=': (lavalue = rvalue)
    }[operator];
  },
  checkNew: function(data){
    var data = Date.parse(data);
    const currentdate = parseInt(Date.now());
    // console.log(currentdate);
    //  console.log(data);
    // var result = parseInt(parseInt(date) - parseInt(currentdate)) >=week 604800; month 2592000000; 15 days 1296000000
    const result = currentdate - data;
    //  console.log(result/60);
    if(result < 2592000000){
      return 'new badge green';
    }
      return '';
  },
  totalcount: function(str){
    if(str.length > 0){
      var num = str.length;

      function nFormatter(num, digits){
        const si = [
          {
            value: 1,
            symbol: ''
          },
          {
            value: 1e3,
            symbol: 'k'
          },
          {
            value: 1e6,
            symbol: 'M'
          },
          {
            value: 1e9,
            symbol: 'G'
          },
          {
            value: 1e12,
            symbol: 'T'
          },
          {
            value: 1e15,
            symbol: 'P'
          },
          {
            value: 1e18,
            symbol: 'E'
          }
        ];
        const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
        let i;
        for(i = si.length - 1; i > 0; i--){
          if(num >= si[i].value){
            break;
          }
        }
        return (
          (num / si[i].value).toFixed(digits).replace(rx, '$1') + si[i].symbol
        );
      }
      return nFormatter(num);
    }
      return (num = 0);
  },
  ratingCalculate: function(rating){
    // console.log(rating);
    const total = 0;
    if(rating.length > 0){
      Array.prototype.sum = function(rating){
        let total = 0;
        for(let i = 0, _len = this.length; i < _len; i++){
          total += this[i][rating];
        }
        return total;
      };
      function nFormatter(num, digits){
        const si = [
          {
            value: 1,
            symbol: ''
          },
          {
            value: 1e3,
            symbol: 'k'
          },
          {
            value: 1e6,
            symbol: 'M'
          },
          {
            value: 1e9,
            symbol: 'G'
          },
          {
            value: 1e12,
            symbol: 'T'
          },
          {
            value: 1e15,
            symbol: 'P'
          },
          {
            value: 1e18,
            symbol: 'E'
          }
        ];
        const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
        let i;
        for(i = si.length - 1; i > 0; i--){
          if(num >= si[i].value){
            break;
          }
        }
        return (num / si[i].value).toFixed(2).replace(rx, '$1') + si[i].symbol;
      }
      const currentvalue = rating.sum('RateValue');
      // console.log(nFormatter(currentvalue));
      return nFormatter(currentvalue / rating.length);
    }
      return 0;
  },
  viewcounting: function(counting){
    if(counting > 0){
      function nFormatter(counting, digits){
        const si = [
          {
            value: 1,
            symbol: ''
          },
          {
            value: 1e3,
            symbol: 'k'
          },
          {
            value: 1e6,
            symbol: 'M'
          },
          {
            value: 1e9,
            symbol: 'G'
          },
          {
            value: 1e12,
            symbol: 'T'
          },
          {
            value: 1e15,
            symbol: 'P'
          },
          {
            value: 1e18,
            symbol: 'E'
          }
        ];
        const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
        let i;
        for(i = si.length - 1; i > 0; i--){
          if(counting >= si[i].value){
            break;
          }
        }
        return (
          (counting / si[i].value).toFixed(digits).replace(rx, '$1') +
          si[i].symbol
        );
      }
      return nFormatter(counting);
    }
      return (counting = 0);
  },
  stripTags: function(input){
    return input.replace(/<(?:.|\n)*?>/gm, '');
  },
  formateDate: function(date, format){
    return moment(date).format(format);
  },
  select: function(selected, options){
    return options
      .fn(this)
      .replace(new RegExp(` value="${selected}"`), '$&selected="selected"')
      .replace(
        new RegExp(`>${selected}</option>`),
        'selected="selected"$&'
      );
  },
  categoryType: function(selected, option){
    return options
      .fn(this)
      .replace(new RegExp(` value="${selected}"`), '$&selected="selected"')
      .replace(
        new RegExp(`>${selected}</option>`),
        'selected="selected"$&'
      );
  },
  editIcon: function(storyUser, loggedUser, storyId, floating = true){
    if(storyUser == loggedUser){
      if(floating){
        return `<a href="/stories/edit/${storyId}" class="btn-floating halfway-fab red"><i class="fas fa-pencil-alt"></i></a>`;
      }
        return `<a href="/stories/edit/${storyId}"><i class="fas fa-pencil-alt"></i></a>`;
    }
      return '';
  },
  //    storyinfo:function (storyid,userid,loggedid) {
  //             var info = {
  //                 storyid : storyid,
  //                 user: userid,
  //                 loggedid: loggedid
  //             };
  //             console.log(info);
  //             if(info.user == null){
  //                 return info;
  //             }
  //             else {
  //                 return info;
  //             }

  //     },
  moderateComments: function(storyId, commentId, floating = true){
    // console.log(`story id : ${storyId}`);
    // console.log(`writer id : ${storyUser}`);
    // console.log(`logged user id : ${loggedUser}`);
    const Storyid = storyId;
    // console.log(`comment id : ${commentId}`);
    if(commentId){
      if(floating){
        // add form post method on api request
        return ` <div class="card-title right commentClose" id="${Storyid}" data-value="${Storyid}/${commentId}" style="padding-right:1rem;padding-top:.5rem;"><i style="color:#999;font-size:1.2rem;" class="material-icons right">close</i></div>`;
      }
        return ` <div class="card-title right" id="${Storyid}" data-value="${Storyid}/${commentId}" style="padding-right:1rem;padding-top:.5rem;"><i style="color:#999;font-size:1.2rem;" class="material-icons right">close</i></div>`;
    }
      return '';
  },
  ratingIcon: function(storyUser, loggedUser, storyId, floating = true){
    if(storyId){
      if(floating && loggedUser){
        return `<div class="rate" type="checked" name="RateValue" data-rate-value='' id="${storyId}"></div>`;
      }
        return `<div class="rate" type="checked" name="RateValue" data-rate-value='' id="${storyId}"></div>`;
    }
      return '';
  },
  copyCode:function(id){
    //console.log(`copyCode id name: ${id}`);
    return id != null || 'undefined' ? `<span onclick="CopyToClipboard('${id}');return false;" class="flex justify-end fa fa-clipboard" style="cursor:pointer"></span>` : '';
  },
  facebookShare: function(host, title){
    if(!host){
      return '';
    }
      return `<a target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=${host}%2F07%2F${title}%2F">
            <button class="button button--large button--dark button--chromeless is-touchIconBlackPulse u-baseColor--buttonDark button--withIcon button--withSvgIcon u-xs-hide" title="Share on Facebook" aria-label="Share on Facebook" data-action="share-on-facebook" data-action-source="post_actions_footer"><span class="svgIcon svgIcon--facebook svgIcon--29px"><svg class="svgIcon-use" width="29" height="29">
                                                    <path d="M16.39 23.61v-5.808h1.846a.55.55 0 0 0 .546-.48l.36-2.797a.551.551 0 0 0-.547-.62H16.39V12.67c0-.67.12-.813.828-.813h1.474a.55.55 0 0 0 .55-.55V8.803a.55.55 0 0 0-.477-.545c-.436-.06-1.36-.116-2.22-.116-2.5 0-4.13 1.62-4.13 4.248v1.513H10.56a.551.551 0 0 0-.55.55v2.797c0 .304.248.55.55.55h1.855v5.76c-4.172-.96-7.215-4.7-7.215-9.1 0-5.17 4.17-9.36 9.31-9.36 5.14 0 9.31 4.19 9.31 9.36 0 4.48-3.155 8.27-7.43 9.15M14.51 4C8.76 4 4.1 8.684 4.1 14.46c0 5.162 3.75 9.523 8.778 10.32a.55.55 0 0 0 .637-.543v-6.985a.551.551 0 0 0-.55-.55H11.11v-1.697h1.855a.55.55 0 0 0 .55-.55v-2.063c0-2.02 1.136-3.148 3.03-3.148.567 0 1.156.027 1.597.06v1.453h-.924c-1.363 0-1.93.675-1.93 1.912v1.78c0 .3.247.55.55.55h2.132l-.218 1.69H15.84c-.305 0-.55.24-.55.55v7.02c0 .33.293.59.623.54 5.135-.7 9.007-5.11 9.007-10.36C24.92 8.68 20.26 4 14.51 4"></path>
                                                </svg></span></button><a/>`;
  },
  twitterShare: function(host, title){
    if(!host){
      return '';
    }
      title = title.replace(' ', '+');
      return `<a target="_blank" href="https://twitter.com/intent/tweet?text=${title}&amp;url=${host}&amp;via=storybook">
             <button class="button button--large button--dark button--chromeless is-touchIconBlackPulse u-baseColor--buttonDark button--withIcon button--withSvgIcon u-xs-hide"
                            title="Share on Twitter" aria-label="Share on Twitter" data-action="share-on-twitter"
                            data-action-source="post_actions_footer"><span class="svgIcon svgIcon--twitter svgIcon--29px"><svg
                                    class="svgIcon-use" width="29" height="29" viewBox="0 0 29 29">
                                    <path d="M21.967 11.8c.018 5.93-4.607 11.18-11.177 11.18-2.172 0-4.25-.62-6.047-1.76l-.268.422-.038.5.186.013.168.012c.3.02.44.032.6.046 2.06-.026 3.95-.686 5.49-1.86l1.12-.85-1.4-.048c-1.57-.055-2.92-1.08-3.36-2.51l-.48.146-.05.5c.22.03.48.05.75.08.48-.02.87-.07 1.25-.15l2.33-.49-2.32-.49c-1.68-.35-2.91-1.83-2.91-3.55 0-.05 0-.01-.01.03l-.49-.1-.25.44c.63.36 1.35.57 2.07.58l1.7.04L7.4 13c-.978-.662-1.59-1.79-1.618-3.047a4.08 4.08 0 0 1 .524-1.8l-.825.07a12.188 12.188 0 0 0 8.81 4.515l.59.033-.06-.59v-.02c-.05-.43-.06-.63-.06-.87a3.617 3.617 0 0 1 6.27-2.45l.2.21.28-.06c1.01-.22 1.94-.59 2.73-1.09l-.75-.56c-.1.36-.04.89.12 1.36.23.68.58 1.13 1.17.85l-.21-.45-.42-.27c-.52.8-1.17 1.48-1.92 2L22 11l.016.28c.013.2.014.35 0 .52v.04zm.998.038c.018-.22.017-.417 0-.66l-.498.034.284.41a8.183 8.183 0 0 0 2.2-2.267l.97-1.48-1.6.755c.17-.08.3-.02.34.03a.914.914 0 0 1-.13-.292c-.1-.297-.13-.64-.1-.766l.36-1.254-1.1.695c-.69.438-1.51.764-2.41.963l.48.15a4.574 4.574 0 0 0-3.38-1.484 4.616 4.616 0 0 0-4.61 4.613c0 .29.02.51.08.984l.01.02.5-.06.03-.5c-3.17-.18-6.1-1.7-8.08-4.15l-.48-.56-.36.64c-.39.69-.62 1.48-.65 2.28.04 1.61.81 3.04 2.06 3.88l.3-.92c-.55-.02-1.11-.17-1.6-.45l-.59-.34-.14.67c-.02.08-.02.16 0 .24-.01 2.12 1.55 4.01 3.69 4.46l.1-.49-.1-.49c-.33.07-.67.12-1.03.14-.18-.02-.43-.05-.64-.07l-.76-.09.23.73c.57 1.84 2.29 3.14 4.28 3.21l-.28-.89a8.252 8.252 0 0 1-4.85 1.66c-.12-.01-.26-.02-.56-.05l-.17-.01-.18-.01L2.53 21l1.694 1.07a12.233 12.233 0 0 0 6.58 1.917c7.156 0 12.2-5.73 12.18-12.18l-.002.04z"></path>
                                </svg></span></button></a>`;
  },
  googleplusShare: function(host, title){
    if(!host){
      return '';
    }
      title = title.replace(' ', '+');
      return `<a target="_blank" href="https://plus.google.com/share?url=${host}">
             <button class="button button--large button--dark button--chromeless is-touchIconBlackPulse u-baseColor--buttonDark button--withIcon button--withSvgIcon u-xs-hide"
                            title="Share on Twitter" aria-label="Share on Twitter" data-action="share-on-twitter"
                            data-action-source="post_actions_footer"><span class="svgIcon svgIcon--twitter svgIcon--29px">
                            <svg class="svgIcon-use" width="29" height="29" viewBox="0 0 29 29">
                                   <g fill="none" fill-rule="evenodd"><path d="M20.66 12.693c0-.603-.054-1.182-.155-1.738H12.5v3.287h4.575a3.91 3.91 0 0 1-1.697 2.566v2.133h2.747c1.608-1.48 2.535-3.65 2.535-6.24z" fill="#4285F4"></path><path d="M12.5 21c2.295 0 4.22-.76 5.625-2.06l-2.747-2.132c-.76.51-1.734.81-2.878.81-2.214 0-4.088-1.494-4.756-3.503h-2.84v2.202A8.498 8.498 0 0 0 12.5 21z" fill="#34A853"></path><path d="M7.744 14.115c-.17-.51-.267-1.055-.267-1.615s.097-1.105.267-1.615V8.683h-2.84A8.488 8.488 0 0 0 4 12.5c0 1.372.328 2.67.904 3.817l2.84-2.202z" fill="#FBBC05"></path><path d="M12.5 7.38c1.248 0 2.368.43 3.25 1.272l2.437-2.438C16.715 4.842 14.79 4 12.5 4a8.497 8.497 0 0 0-7.596 4.683l2.84 2.202c.668-2.01 2.542-3.504 4.756-3.504z" fill="#EA4335"></path></g>
                                </svg></span></button></a>`;
  },
  pinterestShare: function(host, title){
    if(!host){
      return '';
    }
      title = title.replace(' ', '+');
      return `<a target="_blank" href="https://pinterest.com/pin/create/button/?url=${host}%2F&amp;media=storybook&amp;description=${title}">
             <button class="button button--large button--dark button--chromeless is-touchIconBlackPulse u-baseColor--buttonDark button--withIcon button--withSvgIcon u-xs-hide"
                            title="Share on Twitter" aria-label="Share on Twitter" data-action="share-on-twitter"
                            data-action-source="post_actions_footer"><span class="svgIcon svgIcon--twitter svgIcon--29px">
                            <svg class="svgIcon-use" width="24" height="24" viewBox="0 0 24 24">
                                 <path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" fill-rule="evenodd" clip-rule="evenodd"></path>
                                </svg></span></button></a>`;
  },
  linkedinShare: function(host, title, description){
    if(!host){
      return '';
    }
      return `<a target="_blank" href="https://www.linkedin.com/shareArticle?mini=true&amp;url=${host}&amp;title=${title}&amp;summary=${description}">
             <button class="button button--large button--dark button--chromeless is-touchIconBlackPulse u-baseColor--buttonDark button--withIcon button--withSvgIcon u-xs-hide"
                            title="Share on Twitter" aria-label="Share on Twitter" data-action="share-on-twitter"
                            data-action-source="post_actions_footer"><span class="svgIcon svgIcon--twitter svgIcon--29px">
                            <svg class="svgIcon-use" width="29" height="29" viewBox="0 0 29 29">
                                 <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.496-1.1-1.109 0-.612.492-1.109 1.1-1.109s1.1.497 1.1 1.109c0 .613-.493 1.109-1.1 1.109zm8 6.891h-1.998v-2.861c0-1.881-2.002-1.722-2.002 0v2.861h-2v-6h2v1.093c.872-1.616 4-1.736 4 1.548v3.359z"></path>
                                </svg></span></button></a>`;
  },
  // Language helper
  __: () => { return i18n.__(this, arguments); }, // eslint-disable-line no-undef
  __n: () => { return i18n.__n(this, arguments); }, // eslint-disable-line no-undef
  availableLanguages: (block) => {
      let total = '';
      for(const lang of i18n.getLocales()){
          total += block.fn(lang);
          // winston.info("Available Languages: ", lang);
          console.log(`Available Languages ${lang}`)
      }
      return total;
  },
  partial: (provider) => {
      return `partials/payments/${provider}`;
  },
  perRowClass: (numProducts) => {
      if(parseInt(numProducts) === 1){
          return 'col-6 col-md-12 product-item';
      }
      if(parseInt(numProducts) === 2){
          return 'col-6 col-md-6 product-item';
      }
      if(parseInt(numProducts) === 3){
          return 'col-6 col-md-4 product-item';
      }
      if(parseInt(numProducts) === 4){
          return 'col-6 col-md-3 product-item';
      }

      return 'col-md-6 product-item';
  },
  menuMatch: (title, search) => {
      if(!title || !search){
          return '';
      }
      if(title.toLowerCase().startsWith(search.toLowerCase())){
          return 'class="navActive"';
      }
      return '';
  },
  getTheme: (view) => {

     console.log(`Get Theme:  ${config.theme}/${view}`)
      return `themes/${config.theme}/${view}`;
  },
  formatAmount: (amt) => {
      if(amt){
          return numeral(amt).format('0.00');
      }
      return '0.00';
  },
  amountNoDecimal: (amt) => {
      if(amt){
          return handlebars.helpers.formatAmount(amt).replace('.', '');
      }
      return handlebars.helpers.formatAmount(amt);
  },
  getStatusColor: (status) => {
      switch(status){
          case 'Paid':
              return 'success';
          case 'Approved':
              return 'success';
          case 'Approved - Processing':
              return 'success';
          case 'Failed':
              return 'danger';
          case 'Completed':
              return 'success';
          case 'Shipped':
              return 'success';
          case 'Pending':
              return 'warning';
          default:
              return 'danger';
      }
  },
  checkProductVariants: (variants) => {
      if(variants && variants.length > 0){
          return 'true';
      }
      return 'false';
  },
  currencySymbol: (value) => {
      if(typeof value === 'undefined' || value === ''){
          return '$';
      }
      return value;
  },
  objectLength: (obj) => {
      if(obj){
          return Object.keys(obj).length;
      }
      return 0;
  },
  stringify: (obj) => {
      if(obj){
          return JSON.stringify(obj);
      }
      return '';
  },
  checkedState: (state) => {
      if(state === 'true' || state === true){
          return 'checked';
      }
      return '';
  },
  selectState: (state, value) => {
      if(state === value){
          return 'selected';
      }
      return '';
  },
  isNull: (value, options) => {
      if(typeof value === 'undefined' || value === ''){
          return options.fn(this);
      }
      return options.inverse(this);
  },
  toLower: (value) => {
      if(value){
          return value.toLowerCase();
      }
      return null;
  },
  formatDate: (date, format) => {
      return moment(date).format(format);
  },
  discountExpiry: (start, end) => {
      return moment().isBetween(moment(start), moment(end));
  },
  ifCond: (v1, operator, v2, options) => {
      switch(operator){
          case '==':
              return (v1 === v2) ? options.fn(this) : options.inverse(this);
          case '!=':
              return (v1 !== v2) ? options.fn(this) : options.inverse(this);
          case '===':
              return (v1 === v2) ? options.fn(this) : options.inverse(this);
          case '<':
              return (v1 < v2) ? options.fn(this) : options.inverse(this);
          case '<=':
              return (v1 <= v2) ? options.fn(this) : options.inverse(this);
          case '>':
              return (v1 > v2) ? options.fn(this) : options.inverse(this);
          case '>=':
              return (v1 >= v2) ? options.fn(this) : options.inverse(this);
          case '&&':
              return (v1 && v2) ? options.fn(this) : options.inverse(this);
          case '||':
              return (v1 || v2) ? options.fn(this) : options.inverse(this);
          default:
              return options.inverse(this);
      }
  },
  isAnAdmin: (value, options) => {
      if(value === 'true' || value === true){
          return options.fn(this);
      }
      return options.inverse(this);
  },
  paymentMessage: (status) => {
      if(status === 'Paid'){
          return '<h2 class="text-success">Your payment has been successfully processed</h2>';
      }
      if(status === 'Pending'){
          const paymentConfig = getPaymentConfig();
          if(config.paymentGateway === 'instore'){
              return `<h2 class="text-warning">${paymentConfig.resultMessage}</h2>`;
          }
          return '<h2 class="text-warning">The payment for this order is pending. We will be in contact shortly.</h2>';
      }
      return '<h2 class="text-danger">Your payment has failed. Please try again or contact us.</h2>';
  },
  paymentOutcome: (status) => {
      if(status === 'Paid' || status === 'Pending'){
          return '<h5 class="text-warning">Please retain the details above as a reference of payment</h5>';
      }
      return '';
  },
  upperFirst: (value) => {
      if(value){
          return value.replace(/^\w/, (chr) => {
              return chr.toUpperCase();
          });
      }
      return value;
  },
  math: (lvalue, operator, rvalue, options) => {
      lvalue = parseFloat(lvalue);
      rvalue = parseFloat(rvalue);

      return {
          '+': lvalue + rvalue,
          '-': lvalue - rvalue,
          '*': lvalue * rvalue,
          '/': lvalue / rvalue,
          '%': lvalue % rvalue
      }[operator];
  },
  showCartButtons: (cart) => {
      if(!cart){
          return 'd-none';
      }
      return '';
  },
  snip: (text) => {
      if(text && text.length > 155){
          return `${text.substring(0, 155)}...`;
      }
      return text;
  },
  contains: (values, value, options) => {
      if(values.includes(value)){
          return options.fn(this);
      }
      return options.inverse(this);
  },
  fixTags: (html) => {
      html = html.replace(/&gt;/g, '>');
      html = html.replace(/&lt;/g, '<');
      return html;
  },
  timeAgo: (date) => {
      return moment(date).fromNow();
  },
  feather: (icon) => {
      // eslint-disable-next-line keyword-spacing
      return `<svg class="feather feather-${icon}">
          <use xlink:href="/img/feather-sprite.svg#${icon}"/>
      </svg>`;
  },
};
