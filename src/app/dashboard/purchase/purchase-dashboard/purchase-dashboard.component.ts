import { Component, OnInit, NgModule, TemplateRef,Input, Output, ViewChild, ElementRef,EventEmitter     } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsDropdownModule, TypeaheadModule } from 'ngx-bootstrap';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { TranslateService } from '@ngx-translate/core';
import { MasterService } from 'src/app/dashboard/master/master.service';
import 'src/assets/styles/mainstyles.scss';
import { SharedDataService } from 'src/app/shared/model/shared-data.service';
import { ButtonsComponent } from '../../../commonComponents/buttons/buttons.component';
import * as _ from 'lodash';
import { UserProfileComponent } from 'src/app/admin/user-profile/user-profile.component';

@Component({
  selector: 'app-purchase-dashboard',
  templateUrl: './purchase-dashboard.component.html'
})

@NgModule({
  imports: [
    BsDropdownModule.forRoot(),
    TypeaheadModule.forRoot(),
    BsModalService,
    UserProfileComponent
  ],
})

export class PurchaseDashboardComponent implements OnInit {

  public purchaseForm: FormGroup;
  private endPoint: string = "purchaseentry/";
  private deleteFlag: boolean = true;
  private formSuccess = false;
  private formRequiredError = false;
  private nameFlag = false;
  public gridDataList: any = [];
  private productsList: any = [];
  private suppliersList: any = [];
  private creditAdjList: any = [];
  private debitAdjList: any = [];
  private manfacturerList: any = [];
 
  private typeaheadTaxDataList: any = [];
  private savedSupplierId = 0;
  private modeType: any[];
  

  @ViewChild('focus') focusField: ElementRef;
  @ViewChild(ButtonsComponent) buttonsComponent: ButtonsComponent;
  @Input() isModelWindowView: boolean = false;
  @Input() bodyStyle: string = "col-xs-12";
  @Output() callbackOnModelWindowClose: EventEmitter<null> = new EventEmitter();

  modalRef: BsModalRef;
  message: string;

  constructor(private fb: FormBuilder,
    private translate: TranslateService,
    private sharedDataService:SharedDataService,
    private modalService: BsModalService,
    private masterService: MasterService) {
    translate.setDefaultLang('messages.en');
  }

  
  ngOnInit() {

    this.purchaseForm = this.fb.group({
      id: [],
      purchaseNumber: [],
      invoiceNumber:['', Validators.required],
      purDate: ['', Validators.required],
      invoiceDate: ['', Validators.required],
      accountInformationId: [],
      supplier: ['', Validators.required],
      gstIN: ['', Validators.required],
      wayBill: ['', Validators.required],
      transport: ['', Validators.required],
      numberOfCases: ['', Validators.required],
     
      mode: ['', Validators.required],
      lrNumber: ['', Validators.required],
      lrDate: ['', Validators.required],
      delvFrom: ['', Validators.required],
      productId: [],
      productcode: ['', Validators.required],
      productName: ['', Validators.required],
      batch:['', Validators.required],
      expiry:['', Validators.required],
      qty:['', Validators.required],
      othCharges:['', Validators.required],
      grsValue:['', Validators.required],
      discount:['', Validators.required],
      ptd:['', Validators.required],
      saleRate:['', Validators.required],
      taxId: [],
      tax:['', Validators.required],
      hsnCode:['', Validators.required],
      mrp:['', Validators.required],
      manfacturerId: [],
      mfgName:['', Validators.required],
      purRate:['', Validators.required],
      free:['', Validators.required],
      grossValue:['', Validators.required],
      discountValue:['', Validators.required],
      taxValue:['', Validators.required],
      netValue:['', Validators.required],
      debitAdjustmentLedger:['', Validators.required],
      creditAdjustmentLedger:['', Validators.required],
      remarks:[],
      stateCode:[],
      debitAdjustmentValue:['', Validators.required],
      creditAdjustmentValue:['', Validators.required],
      invoiceValue:['', Validators.required],
      asPerSwgstp:['', Validators.required],
      asPerInvgstp:['', Validators.required],
      asPerSwtaxable:['', Validators.required],
      asPerInvtaxable:['', Validators.required],
      asPerSwcgstAmt:['', Validators.required],
      asPerInvcgstAmt:['', Validators.required],
      asPerSwsgstAmt:['', Validators.required],
      asPerInvsgstAmt:['', Validators.required],
      asPerInvIgstAmt:['', Validators.required],
      asPerSwIgstAmt:['', Validators.required]
      

    });
    this.loadProductData();
    this.loadSupplierData();
    this.loadCreditAdjustmentLedgerData();
    this.loadDebitAdjustmentLedgerData();
    this.loadDebitAdjustmentLedgerData();
    this.loadCreditAdjustmentLedgerData();
    this.loadManfacturerData();
    this.loadTaxTypeaheadData();
    this.modeType = this.sharedDataService.getSharedCommonJsonData().Mode;
    this.focusField.nativeElement.focus();
  }
  onInitialDataLoad(dataList: any[]) {
    this.gridDataList = dataList;
  }

  loadGridData() {
    this.masterService.getData(this.endPoint);
    this.masterService.dataObject.subscribe(list => {
      this.gridDataList = list;
      localStorage.setItem('rowDataLength', JSON.stringify(this.gridDataList.length));
    });
  }

  valueChange(selectedRow: any[]): void {
    this.editable(selectedRow);
  }

  loadProductData() {
    this.masterService.getParentData('product/').subscribe(list => {
      this.productsList = list;
    });
  }

  loadSupplierData() {
    this.masterService.getParentData('accountinformation/').subscribe(list => {
      this.suppliersList = list;
    });
  }
  loadDebitAdjustmentLedgerData() {
    this.masterService.getParentData('accountinformation/').subscribe(list => {
      this.debitAdjList = list;
    });
  }
  loadCreditAdjustmentLedgerData() {
    this.masterService.getParentData('accountinformation/').subscribe(list => {
      this.creditAdjList = list;
    });
  }
  loadManfacturerData() {
    this.masterService.getParentData('manfacturer/').subscribe(list => {
      this.manfacturerList = list;
    });
  }
 

  loadTaxTypeaheadData() {
    this.masterService.getParentData('tax/').subscribe(list => {
      this.typeaheadTaxDataList = list;
    });
  }
  onSelectProduct(event) {
    
    this.purchaseForm.patchValue({ free: event.item.free });
    this.purchaseForm.patchValue({ productId: event.item.id });
    this.purchaseForm.patchValue({ productcode: event.item.productcode });
    this.purchaseForm.patchValue({ netRate: event.item.netRate });
    this.calculateRate();
  }

  calculateRate() {
    
    this.purchaseForm.patchValue({ grossValue: this.purchaseForm.value.qty * this.purchaseForm.value.qty });
    this.purchaseForm.patchValue({ netValue: this.purchaseForm.value.qty * this.purchaseForm.value.qty });
    this.purchaseForm.patchValue({discountValue: this.purchaseForm.value.qty * this.purchaseForm.value.qty });
    this.purchaseForm.patchValue({taxValue: this.purchaseForm.value.qty * this.purchaseForm.value.qty});
  
  }

  onSelectDebitAdjustmentLedger(event) {
      this.purchaseForm.patchValue({ accountInformationId: event.item.id});
    }
  onSelectCreditAdjustmentLedger(event) {
      this.purchaseForm.patchValue({ accountInformationId: event.item.id});
}

  onSelectedTaxTypeahead(event) {
  this.purchaseForm.patchValue({ taxId: event.item.id});
}

onSelectManfacturer(event){
  this.purchaseForm.patchValue({manfacturerId: event.item.id});
}


  onSelectSupplier(event) {
    if (this.savedSupplierId >= 0 && this.savedSupplierId !== event.item.id) {
      this.purchaseForm.patchValue({ accountInformationId: event.item.id });
      this.purchaseForm.patchValue({ gstIN: event.item.gstIN });
      this.purchaseForm.patchValue({ hsnCode: event.item.hsnCode });
      this.purchaseForm.patchValue({stateCode: event.item.stateId})
      this.purchaseForm.patchValue({ purchaseNumber: this.gridDataList.length + 1 });
    }
  }
  
  save() {
    this.savedSupplierId = this.purchaseForm.value.accountInformationId;
    this.buttonsComponent.save();
  }

  delete() {
    this.buttonsComponent.delete();
  }

 
  successMsg() {
    this.formSuccess = true;
    this.formRequiredError = false;
    const tempSupplierId = this.purchaseForm.value.accountInformationId;
    const tempSupplierName = this.purchaseForm.value.supplier;
    this.resetForm(null);
    this.purchaseForm.value.accountInformationId = tempSupplierId;
    this.purchaseForm.value.supplier = tempSupplierName;
  //  this.loadGridData();
  }

  requiredErrMsg() {
      this.formRequiredError = true;
      this.formSuccess = false;
  }

  resetForm(param) {
    const tempSupplierId = this.purchaseForm.value.accountInformationId;
    const tempSupplierName = this.purchaseForm.value.supplier;
    const tempOrderNum = this.purchaseForm.value.purchaseNumber;
    this.purchaseForm.reset();
    if ((param === undefined || param === null ) && !this.nameFlag) {
      this.purchaseForm.patchValue({ accountInformationId: tempSupplierId });
      this.purchaseForm.patchValue({ supplier: tempSupplierName });
      this.purchaseForm.patchValue({ purchaseNumber: tempOrderNum });
    }
    
    this.deleteFlag = true;
    this.nameFlag = false;
    this.formRequiredError = this.formSuccess = false;
    this.loadGridData();
  }

  editable(s) {
    this.nameFlag = true;
    this.formRequiredError = false;
    this.deleteFlag = false;
    this.purchaseForm.reset(s);
    const productObj = _.find(this.productsList, function(o) {return o.id === s.productId; });
    this.onSelectProduct({item : productObj});
  }
}