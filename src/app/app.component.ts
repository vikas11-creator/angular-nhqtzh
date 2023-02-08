import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, AbstractControl } from '@angular/forms';

import { MyInterface } from './my-interface';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  constructor(private fb: FormBuilder) {
  }

  form1: FormGroup;
  form2: FormGroup;

  array1: FormArray;
  array2: FormArray;

  model1: MyInterface[] = [
    { id: 1, value: 'a' },
    { id: 2, value: 'b' },
    { id: 3, value: 'c' }
  ];

  model2: MyInterface[] = [
    { id: 7, value: 'x' },
    { id: 8, value: 'y' },
    { id: 9, value: 'z' }
  ];

  selected1: MyInterface[] = [];
  selected2: MyInterface[] = [];

  ngOnInit() {
    this.array1 = this.fb.array(this.model1.map(x => this.fb.group({
      value: this.fb.control(x.value)
    })));
    this.array2 = this.fb.array(this.model2.map(x => this.fb.group({
      value: this.fb.control(x.value)
    })));

    this.form1 = this.fb.group({
      array: this.array1
    });

    this.form2 = this.fb.group({
      array: this.array2
    });
  }

  onSelect(listNumber: number, item: MyInterface) {
    const selected: MyInterface[] = this.getSelected(listNumber);
    const index: number = selected.indexOf(item);
    if (index >= 0) {
      selected.splice(index, 1);
    } else {
      selected.push(item);
    }
  }

  onSubmit(listNumber: number) {
    const model: MyInterface[] = this.getModel(listNumber);
    const formArray: FormArray = this.getFormArray(listNumber);

    // update model from form
    formArray.controls.forEach((group: FormGroup, i: number) => {
      model[i].value = group.get('value').value;
    });
  }

  moveFrom(fromListNumber: number) {
    const selected: MyInterface[] = this.getSelected(fromListNumber);
    if (selected.length === 0) {
      return;
    }

    const toListNumber: number = fromListNumber === 1 ? 2 : 1;

    const fromModel: MyInterface[] = this.getModel(fromListNumber);
    const fromFormArray: FormArray = this.getFormArray(fromListNumber);

    const toModel: MyInterface[] = this.getModel(toListNumber);
    const toFormArray: FormArray = this.getFormArray(toListNumber);

    // remove items and form groups    
    selected.forEach((item: MyInterface) => {
      const index: number = fromModel.indexOf(item);
      const formGroup: FormGroup = fromFormArray.controls[index] as FormGroup;

      // remove from model
      fromModel.splice(index, 1);
      // remove from from array
      fromFormArray.removeAt(index);

      // add to form array
      toFormArray.push(formGroup);
      // add item to model
      toModel.push(item);
    });        
    
    // clear selected
    selected.length = 0;
  }

  private getFormArray(arrayNumber: number): FormArray {
    return arrayNumber === 1 ? this.array1 : this.array2;
  }

  private getModel(modelNumber: number): MyInterface[] {
    return modelNumber === 1 ? this.model1 : this.model2;
  }

  private getSelected(listNumber: number): MyInterface[] {
    return listNumber === 1 ? this.selected1 : this.selected2;
  }

  private onValueChanges(): void {

  }
}
