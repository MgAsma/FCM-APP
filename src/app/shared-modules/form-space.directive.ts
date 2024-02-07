import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appFormSpace]'
})
export class FormSpaceDirective {

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  @HostListener('input', ['$event']) onInput(event: Event) {
    const inputElement = this.el.nativeElement as HTMLInputElement | HTMLTextAreaElement;
    const currentValue = inputElement.value;
    const trimmedValue = currentValue.replace(/^\s+/, ''); // Remove leading spaces for the first word of a sentence
    this.renderer.setProperty(inputElement, 'value', trimmedValue);
  }
}
