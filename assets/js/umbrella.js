var Umbrella = {
    colors: ["pink", "blue", "yellow"], //set of colors
    active: null, //active color id, eg. pink
    accepted_formats: ['image/png', 'image/jpg', 'image/jpeg'],
    logo: {
        url: null, //Customer logo url
        file_name: null, //file name of the logo uploaded
        set _file_name(file_name){ //set file name after processing name string

            if(file_name && file_name.length > 16){ //if name exceeds 17 length, then short the file name
                file_name = file_name.substring(0, 6) + "..." + file_name.substring(file_name.length - 7, file_name.length);
            }
    
            this.file_name = file_name.toUpperCase(); //uppercase to make it more readable
        },
    },
    set theme(colorId){ //Core function to change theme, with colorId
        
        //if theme present
        if(this.colors.indexOf(colorId) !== -1 && this.active !== colorId){
            //loader
            this.loader(true);
            
            this.active = colorId;
            this.applyTheme();

            //remove loader 
            this.loader(false);
        }
    },
    applyTheme: function(){

        this.events.attach();
        this.changeImage();
        this.changeColors();
        this.checkLogo();
    },
    changeImage: function(){ //Change preview image, on color change
        var $img = document.querySelector(".preview");

        $img.setAttribute("src", "./assets/" + this.active + "-umbrella.png");
    },
    changeColors: function(){ //applying colors to each elements
        var $body = document.querySelector("body");
        var $controller = document.querySelector(".umbrella-controller");
        
        this.colors.map(function(v,k){
            
            $body.classList.remove("bg-"+v);
            $controller.classList.remove("theme-"+v);
        });

        $body.classList.add("bg-"+this.active); //change body bg color
        $controller.classList.add("theme-"+this.active); //change all child colors
    },
    events: { //Click and change events attached through here
        attached: false, //flag to avoid attaching multiple events
        attach: function(){

            if(this.attached) return true; //if event is already attached then dont attach it again

            this.attached = true; //flag to true

            var _this = Umbrella;

            var $color_selector = document.querySelectorAll(".color-selector");
            var $upload_btn = document.querySelector(".upload-logo-btn");
            var $close_btn = $upload_btn.querySelector(".close");
            var $upload_file = document.querySelector("#upload-file");

            //color selection event
            $color_selector.forEach(function($element, key){ 

                $element.addEventListener('click', function(){
                    _this.setColorCheckBox(this);
                });
                
            });

            //Upload logo
            if($upload_btn.getAttribute('listener') !== 'true'){

                $upload_btn.addEventListener("click", function(e){
                    e.stopPropagation();
                    $upload_file.click();
                }, false);
            }

            //Cancel/ close/ remove logo
            if($close_btn.getAttribute('listener') !== 'true'){

                $close_btn.addEventListener("click", function(e){
                    e.stopPropagation();
                    _this.removeLogo(e);
                }, false);
            }
            
            //On change upload file image
            if($upload_file.getAttribute('listener') !== 'true'){

                $upload_file.addEventListener("change", function(){
                    
                    //show loader
                    _this.loader(true);

                    if(this.files && this.files[0]){
                        
                        var file = this.files[0];

                        if(!_this.accepted_formats.includes(file.type)) {

                            alert("Invalid File format");

                            //remove loader
                            _this.loader(false);

                            return false;
                        }

                        _this.logo._file_name = file.name;

                        _this.toDataURL(file, function(dataURL){ //get base64 data as url from file
                            
                            _this.logo.url = dataURL;
                            _this.checkLogo();

                            //remove loader
                            _this.loader(false);
                        });
                    }
                    else{
                        console.log("Please select a logo to upload");

                        //remove loader
                        _this.loader(false);
                    }
                }, false);
            }
        },
    },
    setColorCheckBox: function($checkbox){ 
        //Clear checkboxes to default state
        this.clearColorCheckBoxes();

        $checkbox.classList.add("selected");

        this.theme = $checkbox.getAttribute("data-color");
    },
    toDataURL: function(file, callback){ //get base64 data as url from file object
        
        var reader = new FileReader();

        reader.onload = function(event) {
            callback(event.target.result);
        };

        reader.readAsDataURL(file);
    },
    clearColorCheckBoxes: function(){ //clear the color radio
        document.querySelectorAll(".color-selector").forEach(function($element, key){ 
            $element.classList.remove("selected");
        });
    },
    checkLogo: function(){ //Customer logo upload
        if(this.logo.file_name && this.logo.url){
            document.querySelector(".upload-text").innerHTML = this.logo.file_name;
            document.querySelector(".upload-logo-btn .close").classList.remove("hidden");
            document.querySelector(".img-logo").setAttribute('src', this.logo.url);
        }
        else{
            document.querySelector(".upload-text").innerHTML = "UPLOAD LOGO";
            document.querySelector(".upload-logo-btn .close").classList.add("hidden");
            document.querySelector(".img-logo").setAttribute('src', "");
        }
    },
    removeLogo: function(){
        this.logo.file_name = "";
        this.logo.url = "";
        document.querySelector("#upload-file").value = "";
        this.checkLogo(); //re initialize logo
    },
    loader: function(active){
        if(active){
            document.querySelector(".umbrella-controller").classList.add("load");
        }
        else{

            setTimeout(function(){
                document.querySelector(".umbrella-controller").classList.remove("load");
            }, 1000);
            
        }
    }

};