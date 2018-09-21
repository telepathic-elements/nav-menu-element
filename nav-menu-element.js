import {TelepathicElement} from "../telepathic-element/telepathic-element.js";
export default class NavMenuElement extends TelepathicElement{
    static describe(){ return `NavElement is a telepathic-element that is databound and themeable, 
    you can supply your own sitemap per instance or it will load from the default navigation.json for example 
    <pre>
    <nav-element></nav-element>
    </pre> to use the default ./navigation.json or 
    <pre>
    <nav-element nav-map='somedir/mynav.json'></nav-element>
    </pre>
    to use the file at 'somerdir/mynav.json'
    `;}
	constructor(){
        //Construct this without a shadow dom
        //super(null,false,true);
        super();
        this.nav = document.createElement("ul");
    }
    
    async init(){
        //Set a default so we have something to databind to, because we need to bind a function here
        
        //this.nav = document.createElement("ul");
        if(this.getAttribute("nav-map")){
            this.navMapFileName = this.getAttribute("nav-map");
        }else{
            this.navMapFileName = 'navigation.json';
        }
        
        await this.parseNavFile(this.navMapContents);
        await this.makeNav();
        await this.update();
    }
    //Call this to start the chain of events from a new file
    async parseNavFile(navMapFileName){
        if(navMapFileName){
            this.navMapFileName = navMapFileName;
        }
        this.navMap = await this.loadFileJSON(this.navMapFileName);
        console.log("navMap: ",this.navMap);
        return this;
    }
    //Call this to start the chain of events from a new navMap object
    makeNav(navMap){
        if(navMap){
            this.navMap = navMap;
        }
        //A navMap is an array of navItems in their Object form
        //Each element contains, .name, .loc, .priority, .visibility, .text
        this.navItems = [];
        for(let item of this.navMap){
            let li = document.createElement("li");
            li.setAttribute("class","nav-item");
            let a = document.createElement("a");
            a.setAttribute("href",item.url);
            a.innerHTML = item.txt; 
            li.appendChild(a);
            this.navItems.push(li);
        }
        return this;
    }

    update(){
        if(typeof this.nav !== HTMLUListElement){
            this.nav = document.createElement("ul");
        }
        while(this.nav.firstChild) {
            this.nav.removeChild(this.nav.firstChild);
        }
        for(let navItem of this.navItems){
            this.nav.appendChild(navItem);
        }
    }
}