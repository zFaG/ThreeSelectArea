/**
 * LArea移动端城市选择控件
 *
 * version:1.7.2
 *
 * author:黄磊
 *
 * git:https://github.com/xfhxbb/LArea
 *
 * Copyright 2016
 */
window.LArea = (function() {
    var MobileArea = function() {
        this.gearArea;
        this.url;
        this.index = 0;
        this.value = [0, 0, 0];
        this.data = [];
        this.firstParentId = ''; //初始化的parentId
        this.selentAreaIndexPath = []; //当前选中的区域index
        console.log(this.selentAreaIndexPath)
    }
    MobileArea.prototype = {
        init: function(params) {
            this.params = params;
            this.trigger = document.querySelector(params.trigger);
            if(params.valueTo){
                this.valueTo=document.querySelector(params.valueTo);
            }
            this.keys = params.keys;
            this.type = params.type||1;
            switch (this.type) {
                case 1:
                case 2:
                    break;
                default:
                    throw new Error('错误提示: 没有这种数据源类型');
                    break;
            }
            this.bindEvent();
        },


        getData: function(callback, parentId) {
            var _self = this;
            var everlOneIndex = _self.selentAreaIndexPath[0];
            var everlTwoIndex = _self.selentAreaIndexPath[1];
            var everlThreeIndex = _self.selentAreaIndexPath[2]

            //如果没有传parentId就获取初始化配置的parentId
            parentId = parentId || _self.params.firstParentId;

            var firstData = _self.getDateList(parentId);

            //初始化数据时
            if(_self.data.length == 0){
                _self.data = firstData;

                //获取二级数据
                var secondData = _self.getDateList(_self.data[0].id);
                _self.data[0].child = secondData;

                //获取三级数据
                if(_self.data[0].child.length == 0){
                    return
                }
                var thirdDate = _self.getDateList(_self.data[0].child[0].id);
                if(thirdDate.length !==0){
                    _self.data[0].child[0].child = thirdDate;
                }else{
                    return;
                }
            }else{
                if (everlThreeIndex == 0 || everlThreeIndex) {
                    return;
                }else if(everlTwoIndex == 0 || everlTwoIndex){
                    //获取三级数据
                    var thirdDate = _self.getDateList(_self.data[everlOneIndex].child[everlTwoIndex].id);
                    if(thirdDate.length !==0){
                        _self.data[everlOneIndex].child[everlTwoIndex].child = thirdDate
                    }else{
                        return;
                    }
                }else {
                    //获取二级数据
                    var secondData = _self.getDateList(_self.data[everlOneIndex].id);
                    _self.data[everlOneIndex].child = secondData;
                    //获取三级数据
                    if(!_self.data[everlOneIndex].child[0]){
                        return
                    }
                    var thirdDate = _self.getDateList(_self.data[everlOneIndex].child[0].id);
                    if(thirdDate.length==0){
                            return;
                        }else{
                            _self.data[everlOneIndex].child[0].child = thirdDate
                        }
                }
            }
            if (callback) {
                callback()
            };
            var vale = document.getElementById('area').value;
            console.log(vale)
        },
        getDateList: function (parentId) {
            var _self = this;
            var result = {};
            $.ajax({
                type:'post',
                async:false,
                url: _self.params.url,
                data: {parentId: parentId},
                success:function (data){
                    result = data.child;
                }
            });
            return result;
        },
        // getData: function(callback, parentId) {
        //     var _self = this;
        //     var everlOneIndex = _self.selentAreaIndexPath[0];
        //     var everlTwoIndex = _self.selentAreaIndexPath[1];
        //     var everlThreeIndex = _self.selentAreaIndexPath[2]

        //     //如果没有传parentId就获取初始化配置的parentId
        //     parentId = parentId || _self.params.firstParentId;
        //     $.ajax({
        //         type:'post',
        //         async:false,
        //         url: _self.params.url,
        //         data: {parentId: parentId},
        //         success:function (data) {
        //             if(_self.data.length == 0){
        //                 _self.data = data.child;
        //                  $.ajax({
        //                         type:'post',
        //                         async:false,
        //                         url: _self.params.url,
        //                         data: {parentId: _self.data[0].id},
        //                         success:function (data){
        //                             _self.data[0].child = data.child
        //                             $.ajax({
        //                                 type:'post',
        //                                 async:false,
        //                                 url: _self.params.url,
        //                                 data: {parentId: _self.data[0].child[0].id},
        //                                 success:function (data){
        //                                     _self.data[0].child[0].child = data.child
        //                                 }
        //                             })
        //                         } 
        //                     })

        //             }else{
        //                 if (everlThreeIndex = 0 || everlThreeIndex){
        //                     _self.data[everlOneIndex].child[everlTwoIndex].child[everlThreeIndex].child = data.child
        //                 }else if (everlTwoIndex = 0 || everlTwoIndex){
        //                     //根据市级初始化区域的第一个
        //                     $.ajax({
        //                         type:'post',
        //                         async:false,
        //                         url: _self.params.url,
        //                         data: {parentId: _self.data[everlOneIndex].child[everlTwoIndex].id},
        //                         success:function (data){
        //                             console.log(data)
        //                             if(data.child.length !==0){
        //                                 _self.data[everlOneIndex].child[everlTwoIndex].child = data.child
        //                             }else{
        //                                 _self.data[everlOneIndex].child[everlTwoIndex].child = ''
        //                             }
        //                         }  
        //                     })
        //                     // console.log(_self.data[everlOneIndex].child[everlTwoIndex].id.child)
        //                     // if(_self.data[everlOneIndex].child[everlTwoIndex].id.child !== 0){
        //                     //     _self.data[everlOneIndex].child[everlTwoIndex].child = data.child
        //                     // }
        //                 }else{
        //                     //点击省初始化市级的第一个，区域的第一个
        //                     _self.data[everlOneIndex].child = data.child
        //                     console.log(_self.data[everlOneIndex])
        //                     console.log(_self.data[everlOneIndex].child.id)
        //                     // 获取区域的child长度
        //                     $.ajax({
        //                         type:'post',
        //                         async:false,
        //                         url: _self.params.url,
        //                         data: {parentId: _self.data[everlOneIndex].child[0].id},
        //                         success:function (data){
        //                             if(data.child.length==0){
        //                                 _self.data[everlOneIndex].child[0].child = ''
        //                             }else{
        //                                 _self.data[everlOneIndex].child[0].child = data.child
        //                             }
        //                         }  
        //                     })
                            
        //                 }
        //             }

        //             if (callback) {
        //                 callback()
        //             };
        //         }

        //     });
        // },
        bindEvent: function() {
            var _self = this;
            //呼出插件
            function popupArea(e) {
                _self.gearArea = document.createElement("div");
                _self.gearArea.className = "gearArea";
                _self.gearArea.innerHTML = '<div class="area_ctrl slideInUp">' +
                    '<div class="area_btn_box">' +
                    '<div class="area_btn larea_cancel">取消</div>' +
                    '<div class="area_btn larea_finish">确定</div>' +
                    '</div>' +
                    '<div class="area_roll_mask">' +
                    '<div class="area_roll">' +
                    '<div>' +
                    '<div class="gear area_province" data-areatype="area_province" data-everl="1"></div>' +
                    '<div class="area_grid">' +
                    '</div>' +
                    '</div>' +
                    '<div>' +
                    '<div class="gear area_city" data-areatype="area_city" data-everl="2"></div>' +
                    '<div class="area_grid">' +
                    '</div>' +
                    '</div>' +
                    '<div>' +
                    '<div class="gear area_county" data-areatype="area_county" data-everl="3"></div>' +
                    '<div class="area_grid">' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
                document.body.appendChild(_self.gearArea);
                areaCtrlInit();
                var larea_cancel = _self.gearArea.querySelector(".larea_cancel");
                larea_cancel.addEventListener('touchstart', function(e) {
                    _self.close(e);
                });
                var larea_finish = _self.gearArea.querySelector(".larea_finish");
                larea_finish.addEventListener('touchstart', function(e) {
                    _self.finish(e);
                });
                var area_province = _self.gearArea.querySelector(".area_province");
                var area_city = _self.gearArea.querySelector(".area_city");
                var area_county = _self.gearArea.querySelector(".area_county");
                area_province.addEventListener('touchstart', gearTouchStart);
                area_city.addEventListener('touchstart', gearTouchStart);
                area_county.addEventListener('touchstart', gearTouchStart);
                area_province.addEventListener('touchmove', gearTouchMove);
                area_city.addEventListener('touchmove', gearTouchMove);
                area_county.addEventListener('touchmove', gearTouchMove);
                area_province.addEventListener('touchend', gearTouchEnd);
                area_city.addEventListener('touchend', gearTouchEnd);
                area_county.addEventListener('touchend', gearTouchEnd);
            }
            //初始化插件默认值
            function areaCtrlInit() {
                _self.gearArea.querySelector(".area_province").setAttribute("val", _self.value[0]);
                _self.gearArea.querySelector(".area_city").setAttribute("val", _self.value[1]);
                _self.gearArea.querySelector(".area_county").setAttribute("val", _self.value[2]);

                switch (_self.type) {
                    case 1:
                        _self.setGearTooth(_self.data);
                        break;
                    case 2:
                        _self.setGearTooth(_self.data[0]);
                        break;
                }
            }
            //触摸开始
            function gearTouchStart(e) {
                e.preventDefault();
                var target = e.target;
                while (true) {
                    if (!target.classList.contains("gear")) {
                        target = target.parentElement;
                    } else {
                        break
                    }
                }
                clearInterval(target["int_" + target.id]);
                target["old_" + target.id] = e.targetTouches[0].screenY;
                target["o_t_" + target.id] = (new Date()).getTime();
                var top = target.getAttribute('top');
                if (top) {
                    target["o_d_" + target.id] = parseFloat(top.replace(/em/g, ""));
                } else {
                    target["o_d_" + target.id] = 0;
                }
                target.style.webkitTransitionDuration = target.style.transitionDuration = '0ms';
            }
            //手指移动
            function gearTouchMove(e) {
                e.preventDefault();
                var target = e.target;
                while (true) {
                    if (!target.classList.contains("gear")) {
                        target = target.parentElement;
                    } else {
                        break
                    }
                }
                target["new_" + target.id] = e.targetTouches[0].screenY;
                target["n_t_" + target.id] = (new Date()).getTime();
                var f = (target["new_" + target.id] - target["old_" + target.id]) * 30 / window.innerHeight;
                target["pos_" + target.id] = target["o_d_" + target.id] + f;
                target.style["-webkit-transform"] = 'translate3d(0,' + target["pos_" + target.id] + 'em,0)';
                target.setAttribute('top', target["pos_" + target.id] + 'em');
                if(e.targetTouches[0].screenY<1){
                    gearTouchEnd(e);
                };
            }
            //离开屏幕
            function gearTouchEnd(e) {
                e.preventDefault();
                var target = e.target;
                while (true) {
                    if (!target.classList.contains("gear")) {
                        target = target.parentElement;
                    } else {
                        break;
                    }
                }
                var flag = (target["new_" + target.id] - target["old_" + target.id]) / (target["n_t_" + target.id] - target["o_t_" + target.id]);
                if (Math.abs(flag) <= 0.2) {
                    target["spd_" + target.id] = (flag < 0 ? -0.08 : 0.08);
                } else {
                    if (Math.abs(flag) <= 0.5) {
                        target["spd_" + target.id] = (flag < 0 ? -0.16 : 0.16);
                    } else {
                        target["spd_" + target.id] = flag / 2;
                    }
                }
                if (!target["pos_" + target.id]) {
                    target["pos_" + target.id] = 0;
                }
                rollGear(target);
            }
            //缓动效果
            function rollGear(target) {
                var d = 0;
                var stopGear = false;
                function setDuration() {
                    target.style.webkitTransitionDuration = target.style.transitionDuration = '200ms';
                    stopGear = true;
                }
                clearInterval(target["int_" + target.id]);
                target["int_" + target.id] = setInterval(function() {
                    var pos = target["pos_" + target.id];
                    var speed = target["spd_" + target.id] * Math.exp(-0.03 * d);
                    pos += speed;
                    if (Math.abs(speed) > 0.1) {} else {
                        var b = Math.round(pos / 2) * 2;
                        pos = b;
                        setDuration();
                    }
                    if (pos > 0) {
                        pos = 0;
                        setDuration();
                    }
                    var minTop = -(target.dataset.len - 1) * 2;
                    if (pos < minTop) {
                        pos = minTop;
                        setDuration();
                    }
                    if (stopGear) {
                        var gearVal = Math.abs(pos) / 2;
                        setGear(target, gearVal);
                        clearInterval(target["int_" + target.id]);
                    }
                    target["pos_" + target.id] = pos;
                    target.style["-webkit-transform"] = 'translate3d(0,' + pos + 'em,0)';
                    target.setAttribute('top', pos + 'em');
                    d++;
                }, 30);
            }
            //控制插件滚动后停留的值
            function setGear(target, val) {
                val = Math.round(val);
                target.setAttribute("val", val);

                //获取当前选中的区域id
                var selectAreaId = target.childNodes[val].getAttribute('ref');
                // 获取当前所选区域的位置
                var everl = target.getAttribute('data-everl')
                // 把当前选中区域后面的index从selentAreaIndexPath中删除
                _self.selentAreaIndexPath.splice(everl-1,3)
                // 把当前区域的index保存在selentAreaIndexPath中
                _self.selentAreaIndexPath.push(val);
                console.log(_self.selentAreaIndexPath)
                //获取下级的区域列表并渲染；
                _self.getData('', selectAreaId);


                switch (_self.type) {
                    case 1:
                        _self.setGearTooth(_self.data);
                        break;
                    case 2:
                        switch(target.dataset['areatype']){
                            case 'area_province':
                                _self.setGearTooth(_self.data[0]);
                                break;
                            case 'area_city':
                                var ref = target.childNodes[val].getAttribute('ref');
                                var childData=[];
                                var nextData= _self.data[2];
                                for (var i in nextData) {
                                    if(i==ref){
                                        childData = nextData[i];
                                        break;
                                    }
                                };
                                _self.index=2;
                                _self.setGearTooth(childData);
                                break;
                        }
                }

            }
            _self.getData(function() {
                _self.trigger.addEventListener('click', popupArea);
            });
        },
        //重置节点个数
        setGearTooth: function(data) {
            var _self = this;
            var item = data || [];
            var l = item.length;
            var gearChild = _self.gearArea.querySelectorAll(".gear");
            var gearVal = gearChild[_self.index].getAttribute('val');
            var maxVal = l - 1;
            if (gearVal > maxVal) {
                gearVal = maxVal;
            }
            gearChild[_self.index].setAttribute('data-len', l);
            if (l > 0) {
                var id = item[gearVal][this.keys['id']];
                var childData;
                switch (_self.type) {
                    case 1:
                        childData = item[gearVal].child
                        break;
                    case 2:
                        var nextData= _self.data[_self.index+1]
                        for (var i in nextData) {
                            if(i==id){
                                childData = nextData[i];
                                break;
                            }
                        };
                        break;
                }
                var itemStr = "";
                for (var i = 0; i < l; i++) {
                    itemStr += "<div class='tooth'  ref='" + item[i][this.keys['id']] + "'>" + item[i][this.keys['name']] + "</div>";
                }
                gearChild[_self.index].innerHTML = itemStr;
                gearChild[_self.index].style["-webkit-transform"] = 'translate3d(0,' + (-gearVal * 2) + 'em,0)';
                gearChild[_self.index].setAttribute('top', -gearVal * 2 + 'em');
                gearChild[_self.index].setAttribute('val', gearVal);
                _self.index++;
                if (_self.index > 2) {
                    _self.index = 0;
                    return;
                }
                _self.setGearTooth(childData);
            } else {
                gearChild[_self.index].innerHTML = "<div class='tooth'></div>";
                gearChild[_self.index].setAttribute('val', 0);
                if(_self.index==1){
                    gearChild[2].innerHTML = "<div class='tooth'></div>";
                    gearChild[2].setAttribute('val', 0);
                }
                _self.index = 0;
            }
        },
        finish: function(e) {
            var _self = this;
            var area_province = _self.gearArea.querySelector(".area_province");
            var area_city = _self.gearArea.querySelector(".area_city");
            var area_county = _self.gearArea.querySelector(".area_county");
            var provinceVal = parseInt(area_province.getAttribute("val"));
            var provinceText = area_province.childNodes[provinceVal].textContent;
            var provinceCode = area_province.childNodes[provinceVal].getAttribute('ref');
            var cityVal = parseInt(area_city.getAttribute("val"));
            var cityText = area_city.childNodes[cityVal].textContent;
            var cityCode = area_city.childNodes[cityVal].getAttribute('ref');
            var countyVal = parseInt(area_county.getAttribute("val"));
            var countyText = area_county.childNodes[countyVal].textContent;
            var countyCode = area_county.childNodes[countyVal].getAttribute('ref');
            _self.trigger.value = provinceText + ((cityText)?(',' + cityText):(''))+ ((countyText)?(',' + countyText):(''));
            _self.value = [provinceVal, cityVal, countyVal];
            if(this.valueTo){
                this.valueTo.value= provinceCode +((cityCode)?(',' + cityCode):('')) + ((countyCode)?(',' + countyCode):(''));
            }
            _self.close(e);
        },
        close: function(e) {
            e.preventDefault();
            var _self = this;
            var evt = new CustomEvent('input');
            _self.trigger.dispatchEvent(evt);
            document.body.removeChild(_self.gearArea);
            _self.gearArea=null;
        }
    }
    return MobileArea;
})()