export class TimeFn{
	fn = function(){
		/*时间控件参数 前一个时间必须大于后面选的时间*/
		startDate: any;
		endDate: any;
		minStartDate: any;
		maxStartDate:any = {year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate()};
		minEndDate: any;
		maxEndDate:any = {year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate()};        //设定药品核准时间的最大值为今天string;
		objToDate(oriDate: any) {
	        let dateStr = oriDate.year + '-' + oriDate.month + '-' + oriDate.day;
	        return dateStr;
	    }
		setEndInterval($event: any){
			if($event){
				this.minEndDate = $event;
			}else{
				this.minEndDate = null;
			}
		}
		setStrartInterval($event: any){
			if($event){
				this.maxStartDate = $event;
			}else{
				this.maxStartDate = {year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate()};
			}
		}
		 //切换逻辑
	    startIns: any;
		endIns: any;
		toggleStart(timeIns: any){
			timeIns.toggle();
			if(timeIns.isOpen()){
				this.startIns = timeIns;
				if(this.endIns){
					this.endIns.close();
					this.endIns = null;
				}
			}else{
				this.startIns = null;
			}
		}
	
		toggleEnd(timeIns: any){
			timeIns.toggle();
			if(timeIns.isOpen()){
				this.endIns = timeIns;
				if(this.startIns){
					this.startIns.close();
					this.startIns = null;
				}
			}else{
				this.endIns = null;
			}
		}
		@HostListener('document:click',[])
		onDocumnentClick(){
			if(this.endIns){
				this.endIns.close();
				this.endIns = null;
			}
			if(this.startIns){
				this.startIns.close();
				this.startIns = null;
			}
		}
	}
}