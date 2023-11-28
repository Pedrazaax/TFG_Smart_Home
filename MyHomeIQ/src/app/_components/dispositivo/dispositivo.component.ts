import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Device } from 'src/app/_models/device';
import { Room } from 'src/app/_models/room';
import { DeviceFilterService } from 'src/app/_services/devicefilter.service';
import { RoomService } from 'src/app/_services/room.service';

@Component({
  selector: 'app-dispositivo',
  templateUrl: './dispositivo.component.html',
  styleUrls: ['./dispositivo.component.css']
})

export class DispositivoComponent implements AfterViewInit {

  rooms: Room[] = []
  stateAddRoom: boolean = false
  formAddRoom: FormGroup
  isInputFieldVisible = false;

  selectedRoom?: Room;

  devices?: Device[];
  filteredDevices?: Device[];

  @ViewChild('menuButton', { static: true }) menuButton!: ElementRef;
  @ViewChild('dropdownMenu', { static: true }) dropdownMenu!: ElementRef;

  constructor(private roomService: RoomService, private toastr: ToastrService, private devicefilterService: DeviceFilterService){
    this.formAddRoom = new FormGroup({
      nameRoom: new FormControl('', [Validators.required])
    });
  }

  ngAfterViewInit() {
    this.listarRooms()
  }

  showInputField() {
    this.isInputFieldVisible = true;
  }

  addRoom(nameRoom: string, inputElement: HTMLInputElement) {
    inputElement.value = ''; // Limpia el input

    this.rooms.push({name: nameRoom});
    this.isInputFieldVisible = false;

    let devices: Device[] = [];

    let info = {
      name: nameRoom,
      devices: devices
    }

    this.roomService.addRoom(info).subscribe((respuesta:any) => {
      this.toastr.success("Habitación agregada")
      this.listarRooms()
    },
      (error:any) => {
        this.toastr.error(error.error.detail, "Error")
      }
    )
  }

  deleteRoom(room: Room) {
    
    this.roomService.deleteRoom(room).subscribe((respuesta:any) => {
      this.rooms = this.rooms.filter(r => r !== room); // Elimina la habitación de la lista
      this.toastr.success("Habitación eliminada")
      this.listarRooms()
    },
      (error:any) => {
        this.toastr.error(error.error.detail, "Error")
      }
    )

  }

  selectRoom(room: Room) {
    this.devicefilterService.selectRoom(room);
    this.filteredDevices = this.devicefilterService.getFilteredDevices();
  }

  toggleAdd(){
    this.stateAddRoom = !this.stateAddRoom
  }

  listarRooms() {
    this.roomService.listarRooms().subscribe((respuesta: any[]) => {
      this.rooms = respuesta
    },
      (error: any) => {
        this.toastr.error(error.error.detail, "Error")
      }
    )
  }

}





